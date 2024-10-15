import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { Hono } from "hono";
import { verify } from "hono/jwt";
import { createBlogInput, updateBlogInput } from "@coderom/medium-blog";

export const blogRouter = new Hono<{
	Bindings: {
		DATABASE_URL: string;
		JWT_SECRET: string;
	},
	Variables: {
		jwtPayload: string
	}
}>();

blogRouter.use('/*', async (c, next) => {
	const header = c.req.header('Authorization');
	if (!header) {
		c.status(401);
		return c.json({ error: "unauthorized" });
	}
	const tokenToVerify = header.split(' ')[1]
	const decodedPayload = await verify(header, c.env.JWT_SECRET)
	if (!decodedPayload) {
		c.status(401);
		return c.json({ error: "unauthorized" })
	}
	console.log('decodedPayload : ', decodedPayload)
	c.set('jwtPayload', decodedPayload.id);
	await next()
});

blogRouter.post('/', async (c) => {
	const body = await c.req.json();
	const { success } = createBlogInput.safeParse(body);
	if (!success) {
		c.status(411);
		return c.json({
			message: "Inputs not correct"
		})
	}
	const jwtPayload = c.get('jwtPayload');
	const prisma = new PrismaClient({
		datasourceUrl: c.env?.DATABASE_URL,
	}).$extends(withAccelerate());

	const post = await prisma.post.create({
		data: {
			title: body.title,
			content: body.content,
			authorId: jwtPayload
		}
	});
	return c.json({
		id: post.id,
		message: 'Blog post created successfully.'
	});
})

blogRouter.put('/', async (c) => {
	const body = await c.req.json();
	const { success } = updateBlogInput.safeParse(body);
	if (!success) {
		c.status(411);
		return c.json({
			message: "Inputs not correct"
		})
	}
	const jwtPayload = c.get('jwtPayload');
	const prisma = new PrismaClient({
		datasourceUrl: c.env?.DATABASE_URL,
	}).$extends(withAccelerate());

	prisma.post.update({
		where: {
			id: body.id,
			authorId: jwtPayload
		},
		data: {
			title: body.title,
			content: body.content
		}
	});

	c.status(201);
	return c.text('Blog post updated successfully.');
});

blogRouter.get('/all', async (c) => {
	const prisma = new PrismaClient({
		datasourceUrl: c.env?.DATABASE_URL,
	}).$extends(withAccelerate());

	const posts = await prisma.post.findMany();

	return c.json({
		posts,
		message: 'All blogs fetched successfully.'
	});

})

blogRouter.get('/:id', async (c) => {
	const id = c.req.param('id');
	const prisma = new PrismaClient({
		datasourceUrl: c.env?.DATABASE_URL,
	}).$extends(withAccelerate());

	const post = await prisma.post.findUnique({
		where: {
			id
		}
	});

	return c.json(post);
})

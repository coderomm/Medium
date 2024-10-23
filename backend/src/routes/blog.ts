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
		jwtPayload: string;
	}
}>();

blogRouter.use('/*', async (c, next) => {
	const header = c.req.header('Authorization');
	if (!header) {
		c.status(401);
		return c.json({ error: "unauthorized" });
	}
	try {
		const tokenToVerify = header.split(' ')[1]
		const decodedPayload = await verify(header, c.env.JWT_SECRET)
		if (!decodedPayload) {
			c.status(403);
			return c.json({
				message: "You are not logged in"
			})
		}
		c.set('jwtPayload', decodedPayload.id);
		await next()
	} catch (e) {
		c.status(403);
		return c.json({
			message: "You are not logged in"
		})
	}
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

	const blog = await prisma.blog.create({
		data: {
			title: body.title,
			content: body.content,
			authorId: jwtPayload
		}
	});
	return c.json({
		id: blog.id,
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

	prisma.blog.update({
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

	const blogs = await prisma.blog.findMany({
		select: {
			content: true,
			title: true,
			id: true,
			author: {
				select: {
					name: true
				}
			}
		}
	});
	return c.json({
		blogs,
		message: 'All blogs fetched successfully.'
	});
})

blogRouter.get('/:id', async (c) => {
	const id = c.req.param('id');
	const prisma = new PrismaClient({
		datasourceUrl: c.env?.DATABASE_URL,
	}).$extends(withAccelerate());

	const blog = await prisma.blog.findFirst({
		where: {
			id: id
		},
		select: {
			id: true,
			title: true,
			content: true,
			published: true,
			author: {
				select: {
					name: true
				}
			},
		}
	});

	return c.json(blog);
})

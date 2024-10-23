import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { Hono } from "hono";
import { sign } from "hono/jwt";
import { signupInput, signinInput } from "@coderom/medium-blog";

type Bindings = {
  DATABASE_URL: string
  JWT_SECRET: string,
}
type Variables = {
  userId: string
}

export const userRouter = new Hono<{
  Bindings: Bindings,
  Variables: Variables
}>();

userRouter.post('/signup', async (c) => {
  const body = await c.req.json();
  const { success } = signupInput.safeParse(body);
  if (!success) {
    c.status(400);
    return c.json({ message: "Invalid inputs" })
  }
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate())

  try {
    const user = await prisma.user.create({
      data: {
        username: body.username,
        password: body.password,
        name: body.name
      }
    })
    const jwt = await sign({ id: user.id }, c.env.JWT_SECRET);
    c.status(201)
    return c.text(jwt)
  } catch (e) {
    console.error(e);
    c.status(500)
    return c.json({ message: 'Signup failed due to server error' });
  }
})

userRouter.post('/signin', async (c) => {
  const body = await c.req.json();
  const { success } = signinInput.safeParse(body);
  if (!success) {
    c.status(400);
    return c.json({
      message: "Invalid inputs"
    })
  }

  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate())

  try {
    const user = await prisma.user.findFirst({
      where: {
        username: body.username,
        password: body.password,
      }
    })
    if (!user) {
      c.status(403);
      return c.json({ message: "Incorrect username or password" })
    }
    const jwt = await sign({
      id: user.id
    }, c.env.JWT_SECRET);

    c.status(200)
    return c.text(jwt)
  } catch (e) {
    console.log(e);
    c.status(411);
    return c.text('Invalid')
  }
})
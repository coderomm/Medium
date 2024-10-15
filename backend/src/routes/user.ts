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
    c.status(411);
    return c.json({
      message: "Inputs not correct"
    })
  }
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate())

  try {
    const user = await prisma.user.create({
      data: {
        email: body.email,
        password: body.password
      }
    })
    const jwt = await sign({ id: user.id }, c.env.JWT_SECRET)
    console.log('jwt signup : ', jwt)
    return c.json({ jwt })
  } catch (e) {
    console.error('signup e: ', e)
    c.status(403)
    return c.json({ error: "error while signing up" });
  }
})

userRouter.post('/signin', async (c) => {
  const body = await c.req.json();
  const { success } = signinInput.safeParse(body);
  if (!success) {
    c.status(411);
    return c.json({
      message: "Inputs not correct"
    })
  }
  const prisma = new PrismaClient({
    datasourceUrl: c.env?.DATABASE_URL,
  }).$extends(withAccelerate());
  const user = await prisma.user.findUnique({
    where: {
      email: body.email,
      password: body.password
    }
  })
  if (!user) {
    c.status(403);
    return c.json({ error: "user not found" })
  }
  const jwt = await sign({ id: user.id }, c.env.JWT_SECRET)
  console.log('jwt signin : ', jwt)
  return c.json({ jwt });
})


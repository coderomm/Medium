import { Hono } from 'hono'
import { blogRouter } from './routes/blog';
import { userRouter } from './routes/user';

type Bindings = {
  DATABASE_URL: string
  JWT_SECRET: string,
}
type Variables = {
  userId: string
}

const app = new Hono<{
  Bindings: Bindings,
  Variables: Variables
}>();

app.get('/', (c: any) => {
  return c.json({
    ok: true,
    message: 'Hello Hono!',
  })
})
app.route('/api/v1/user', userRouter)
app.route('/api/v1/blog', blogRouter)

export default app

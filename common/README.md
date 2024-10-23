A simple TypeScript package providing input validation for a Medium-like blog platform using Zod.

## Features
- **Signup** validation
- **Signin** validation
- **Blog Creation** validation
- **Blog Update** validation
- TypeScript support for all schemas

## Installation

```bash
npm i @coderom/medium-blog
```

## Usage

### Import Schemas and Types

```ts
import { signupInput, signinInput, createBlogInput, updateBlogInput } from '@coderom/medium-blog';
```

### Example Validation

#### Signup

```ts
const result = signupInput.safeParse({
  username: "user@example.com",
  password: "password123",
  name: "John Doe"
});

if (!result.success) {
  console.log(result.error);
}
```

#### Blog Creation

```ts
const result = createBlogInput.safeParse({
  title: "My Blog",
  content: "This is the blog content."
});

if (!result.success) {
  console.log(result.error);
}
```

## Types

You can also import the inferred TypeScript types:

```ts
import { SignupInput, CreateBlogInput } from '@coderom/medium-blog';
```

## License

[MIT](https://choosealicense.com/licenses/mit/)
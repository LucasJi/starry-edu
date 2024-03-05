# StarryEdu Frontend

## Docker

```shell
docker build --platform linux/amd64 --rm -t registry.cn-shanghai.aliyuncs.com/lucasji/starry-edu-frontend:latest .
```

## Environment variables

```dotenv
NEXT_PUBLIC_EDU_ADMIN_URL=http://localhost:8201
NEXT_PUBLIC_IDP_URL=http://localhost:8000
NEXT_PUBLIC_BASE_URL=http://localhost:3000
NEXTAUTH_SECRET=iLl18Ax7DIJ2lt2sQqyRDsjVQmtozqlokDH6snkq0q8=
STARRY_CLIENT_ID=starry-edu
STARRY_CLIENT_SECRET=starry
```

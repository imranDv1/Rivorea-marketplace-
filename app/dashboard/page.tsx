import { prisma } from "@/lib/db";
import { Users } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
async function page() {
  // const users = await prisma.user.findMany();

  const users = prisma.user.findMany()

    const session = await auth.api.getSession({
      headers: await headers(),
    });
  
    const userId = session?.user?.id;
  
    let roles: { admin: boolean } | null = null;

      if (userId) {
        roles = await prisma.user.findUnique({
          where: {
            id: userId,
          },
          select: {
            admin: true,
          },
        });
      }

      if(!roles?.admin) redirect('/')
  
   


  const products = await prisma.product.findMany()

  return (
    <div className="flex flex-col items-start gap-6 px-10 py-12 ">
      {/* users info  */}
      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl ">Users</CardTitle>
            <CardDescription className="text-lg">
              The number of our users
            </CardDescription>
            <CardContent className="flex  gap-2 items-center mt-10">
              <Users className="size-8 text-primary" />
              <h1 className="text-3xl font-bold">{(await users).length}</h1>
            </CardContent>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl ">Products</CardTitle>
            <CardDescription className="text-lg">
              The number of our products
            </CardDescription>
            <CardContent className="flex  gap-2 items-center mt-10">
              <Users className="size-8 text-primary" />
              <h1 className="text-3xl font-bold">{products.length}</h1>
            </CardContent>
          </CardHeader>
        </Card>
      </div>
      {/* create new product form */}

      <Link href="/dashboard/create" className={buttonVariants()}>
        Create New Product
      </Link>
    </div>
  );
}

export default page;

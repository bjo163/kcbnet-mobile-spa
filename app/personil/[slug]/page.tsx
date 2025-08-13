import Image from "next/image"
import { notFound } from "next/navigation"
import { PERSONIL } from "@/lib/personil"
import { Card, CardContent } from "@/components/ui/card"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { Badge } from "@/components/ui/badge"

export function generateStaticParams() {
  return PERSONIL.map((p) => ({ slug: p.slug }))
}

export default function PersonilDetail({ params }: { params: { slug: string } }) {
  const data = PERSONIL.find((p) => p.slug === params.slug)
  if (!data) return notFound()

  return (
    <main className="container mx-auto px-4 py-6 space-y-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/personil">Personil</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{data.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardContent className="p-4 grid grid-cols-2 gap-4">
            {data.idcards.map((src, i) => (
              <div
                key={src}
                className="relative aspect-[3/5] w-full overflow-hidden rounded-md border"
              >
                <Image
                  src={src}
                  alt={`${data.name} idcard ${i + 1}`}
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </CardContent>
        </Card>
        <div className="space-y-3">
          <h1 className="text-2xl font-semibold">{data.name}</h1>
          <p className="text-muted-foreground">{data.role}</p>
          {data.idNumber && (
            <p className="text-sm">
              No. ID:{" "}
              <span className="font-medium">{data.idNumber}</span>
            </p>
          )}
          <div className="flex flex-wrap gap-2 pt-1">
            {data.company && <Badge variant="secondary">{data.company}</Badge>}
            {data.partner && <Badge>Partner: {data.partner}</Badge>}
          </div>
        </div>
      </div>
    </main>
  )
}
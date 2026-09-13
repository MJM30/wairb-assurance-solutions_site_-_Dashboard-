import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Edit, Eye } from "lucide-react"
import Link from "next/link"

const pages = [
  { id: "1", title: "Accueil", slug: "/", status: "Publié", lastModified: "Aujourd'hui" },
  { id: "2", title: "Nos Solutions", slug: "/solutions", status: "Publié", lastModified: "Hier" },
  { id: "3", title: "À Propos", slug: "/a-propos", status: "Publié", lastModified: "Il y a 3 jours" },
  { id: "4", title: "Contact", slug: "/contact", status: "Publié", lastModified: "Il y a 1 semaine" },
]

export default function PagesManagementPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestion des Pages</h1>
          <p className="text-muted-foreground mt-2">
            Modifiez le contenu (textes, images, bannières) de chaque page de votre site.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Liste des Pages</CardTitle>
          <CardDescription>Sélectionnez une page pour en modifier le contenu.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Titre de la Page</TableHead>
                <TableHead>URL (Slug)</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Dernière modification</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pages.map((page) => (
                <TableRow key={page.id}>
                  <TableCell className="font-medium">{page.title}</TableCell>
                  <TableCell className="text-muted-foreground">{page.slug}</TableCell>
                  <TableCell>
                    <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                      {page.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{page.lastModified}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/dashboard/pages/edit/${page.id}`}>
                          <Edit className="mr-2 h-4 w-4" />
                          Modifier
                        </Link>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Edit, Plus, Trash2 } from "lucide-react"

const mockNews = [
  { id: "1", title: "Lancement de nos nouvelles offres d'assurance", status: "Publié", date: "12 Oct 2026" },
  { id: "2", title: "Wairb participe au salon de l'innovation", status: "Brouillon", date: "05 Oct 2026" },
  { id: "3", title: "Comment bien choisir sa mutuelle santé ?", status: "Publié", date: "28 Sep 2026" },
]

export default function NewsManagementPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Actualités</h1>
          <p className="text-muted-foreground mt-2">
            Rédigez, modifiez et publiez vos articles et annonces.
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Nouvelle Actualité
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Liste des Actualités</CardTitle>
          <CardDescription>Gérez l'ensemble de vos publications.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Titre de l'article</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Date de publication</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockNews.map((news) => (
                <TableRow key={news.id}>
                  <TableCell className="font-medium">{news.title}</TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      news.status === 'Publié' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {news.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{news.date}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="destructive" size="sm">
                        <Trash2 className="h-4 w-4" />
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

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { UploadCloud, Trash2, Link as LinkIcon } from "lucide-react"

const mockMedia = [
  { id: "1", name: "hero-banner.jpg", size: "1.2 MB", url: "https://placehold.co/600x400/png" },
  { id: "2", name: "logo-company.png", size: "45 KB", url: "https://placehold.co/400x400/png" },
  { id: "3", name: "team-photo.jpg", size: "2.4 MB", url: "https://placehold.co/600x400/png" },
  { id: "4", name: "service-1.jpg", size: "800 KB", url: "https://placehold.co/600x400/png" },
  { id: "5", name: "service-2.jpg", size: "750 KB", url: "https://placehold.co/600x400/png" },
]

export default function MediaGalleryPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Galerie de Médias</h1>
          <p className="text-muted-foreground mt-2">
            Gérez toutes les images utilisées sur votre site web.
          </p>
        </div>
        <Button>
          <UploadCloud className="mr-2 h-4 w-4" />
          Uploader une image
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Fichiers récents</CardTitle>
          <CardDescription>Cliquez sur une image pour la prévisualiser ou copier son lien.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {mockMedia.map((media) => (
              <div key={media.id} className="group relative overflow-hidden rounded-lg border bg-background flex flex-col">
                <div className="aspect-square w-full overflow-hidden bg-muted">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={media.url}
                    alt={media.name}
                    className="h-full w-full object-cover transition-all group-hover:scale-105"
                  />
                </div>
                <div className="p-2">
                  <p className="truncate text-sm font-medium">{media.name}</p>
                  <p className="text-xs text-muted-foreground">{media.size}</p>
                </div>
                <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/60 opacity-0 transition-opacity group-hover:opacity-100">
                  <Button variant="secondary" size="icon" className="h-8 w-8 rounded-full" title="Copier le lien">
                    <LinkIcon className="h-4 w-4" />
                  </Button>
                  <Button variant="destructive" size="icon" className="h-8 w-8 rounded-full" title="Supprimer">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

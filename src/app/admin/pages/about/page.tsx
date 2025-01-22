import { getAboutUs, deleteAboutUs } from '@/app/actions/pages/about-us-actions'
import { buttonVariants } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AVAILABLE_ICONS } from '@/config/icons'
import {Plus } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { DataActions } from '@/components/shared/data-actions'

export default async function AboutPage() {
  const aboutUs = await getAboutUs()

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">About Us Page</h1>
        {!aboutUs ? (
          <Link href="/admin/pages/about/create" className={buttonVariants({ variant: "default" })}>
            <Plus className="h-4 w-4 mr-2" />
            Create About Us
          </Link>
        ) : (
          <DataActions
            editHref={`/admin/pages/about/${aboutUs.id}`}
            deleteAction={deleteAboutUs}
            deleteModalTitle="Delete About Us"
            deleteModalDescription="Are you sure you want to delete this About Us page? This action cannot be undone."
            itemId={aboutUs.id}
          />
        )}
      </div>

      {aboutUs ? (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Main Information</CardTitle>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">English Content</h3>
                  <h4 className="text-lg font-medium">{aboutUs.titleEn}</h4>
                  <p className="text-muted-foreground">{aboutUs.descriptionEn}</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Arabic Content</h3>
                  <h4 className="text-lg font-medium" dir="rtl">{aboutUs.titleAr}</h4>
                  <p className="text-muted-foreground" dir="rtl">{aboutUs.descriptionAr}</p>
                </div>
              </div>
              {aboutUs.imageUrl && (
                <div className="relative aspect-video rounded-lg overflow-hidden">
                  <Image
                    src={aboutUs.imageUrl}
                    alt="About Us"
                    fill
                    className="object-cover"
                  />
                </div>
              )}
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-3 gap-6">
            {aboutUs.cards.map((card) => {
              const IconComponent = AVAILABLE_ICONS[card.icon] as React.ElementType
              return (
                <Card key={card.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-4 mb-4">
                      {IconComponent && (
                        <div className="p-2 rounded-lg bg-primary/10">
                          <IconComponent className="h-6 w-6 text-primary" />
                        </div>
                      )}
                      <div>
                        <h3 className="font-semibold">{card.titleEn}</h3>
                        <p className="text-sm text-muted-foreground">{card.descriptionEn}</p>
                      </div>
                    </div>
                    <div className="border-t pt-4">
                      <h3 className="font-semibold text-right" dir="rtl">{card.titleAr}</h3>
                      <p className="text-sm text-muted-foreground text-right" dir="rtl">
                        {card.descriptionAr}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Who We Are</CardTitle>
            </CardHeader>
            <CardContent className="grid md:grid-cols-3 gap-6">
              {aboutUs.whoWeAre.map((item) => (
                <div key={item.id} className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">{item.titleEn}</h3>
                    <p className="text-sm text-muted-foreground">{item.descriptionEn}</p>
                  </div>
                  <div className="border-t pt-4">
                    <h3 className="font-semibold mb-2 text-right" dir="rtl">{item.titleAr}</h3>
                    <p className="text-sm text-muted-foreground text-right" dir="rtl">
                      {item.descriptionAr}
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No About Us information available.</p>
          <p className="text-sm text-muted-foreground mt-2">
            Click the Create button to add About Us content.
          </p>
        </div>
      )}
    </div>
  )
}


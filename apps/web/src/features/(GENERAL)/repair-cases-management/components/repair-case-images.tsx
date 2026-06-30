import * as React from 'react'
import {
  useRepairCaseImagesQuery,
  useUploadRepairCaseImagesMutation,
  useDeleteRepairCaseImageMutation
} from '../hooks/use-repair-case-images'
import { Card, CardContent } from '@servexa-warranty-ai/ui/components/card'
import { Button } from '@servexa-warranty-ai/ui/components/button'
import { Loader2, UploadCloud, Trash2, ImageIcon } from 'lucide-react'
import { Input } from '@servexa-warranty-ai/ui/components/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@servexa-warranty-ai/ui/components/select'
import { Label } from '@servexa-warranty-ai/ui/components/label'
import type { RepairCaseImageType } from '@/libs/api/asc-center/repair-case/data-transfer-object'
import { env } from '@servexa-warranty-ai/env/web'

export function RepairCaseImages({ repairCaseId, hideUpload, hideList }: { repairCaseId: string, hideUpload?: boolean, hideList?: boolean }) {
  const { data, isLoading } = useRepairCaseImagesQuery(repairCaseId)
  const images = data?.metadata || []

  // Client-side pagination logic
  const [displayCount, setDisplayCount] = React.useState(12)
  const displayedImages = images.slice(0, displayCount)
  const hasMore = displayCount < images.length

  const observerRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setDisplayCount((prev) => Math.min(prev + 12, images.length))
        }
      },
      { rootMargin: '100px' }
    )
    if (observerRef.current) {
      observer.observe(observerRef.current)
    }
    return () => observer.disconnect()
  }, [hasMore, images.length])

  const uploadMutation = useUploadRepairCaseImagesMutation()
  const deleteMutation = useDeleteRepairCaseImageMutation()

  const [selectedFiles, setSelectedFiles] = React.useState<File[]>([])
  const [imageType, setImageType] = React.useState<RepairCaseImageType>('before_repair')
  const [description, setDescription] = React.useState('')
  const [isDragActive, setIsDragActive] = React.useState(false)
  const [isUploading, setIsUploading] = React.useState(false)

  const fileInputRef = React.useRef<HTMLInputElement>(null)

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragActive(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragActive(false)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setSelectedFiles(prev => [...prev, ...Array.from(e.dataTransfer.files as FileList)])
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFiles(prev => [...prev, ...Array.from(e.target.files as FileList)])
    }
  }

  const removeSelectedFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index))
  }

  const handleUpload = async (e: React.SubmitEvent) => {
    e.preventDefault()
    if (selectedFiles.length === 0) return

    setIsUploading(true)
    try {
      await uploadMutation.mutateAsync({
        repairCaseId,
        images: selectedFiles,
        imageType,
        description,
      })
      setSelectedFiles([])
      setDescription('')
      if (fileInputRef.current) fileInputRef.current.value = ''
    } catch (error) {
      console.error('Failed to upload some images', error)
    } finally {
      setIsUploading(false)
    }
  }

  const handleDelete = (imageId: string) => {
    if (confirm('Are you sure you want to delete this image?')) {
      deleteMutation.mutate({ repairCaseId, imageId })
    }
  }

  const getImageUrl = (path: string) => {
    if (path.startsWith('http')) return path
    const cleanPath = path.startsWith('/') ? path.substring(1) : path
    const fullPath = cleanPath.startsWith('uploads/') ? cleanPath : `uploads/${cleanPath}`
    return `${env.VITE_SERVER_URL}/${fullPath}`
  }

  return (
    <div className="space-y-6">
      {!hideUpload && (
        <Card>
          <CardContent className="pt-6">
            <form onSubmit={handleUpload} className="flex flex-col gap-4">
              <div
                className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors flex flex-col items-center justify-center min-h-[250px] sm:min-h-[350px] ${isDragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25 hover:border-primary/50'}`}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <Input
                  ref={fileInputRef}
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handleFileSelect}
                />
                <UploadCloud className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                <p className="text-sm font-medium">Click or drag images here</p>
                <p className="text-xs text-muted-foreground mt-1">Supports multiple files</p>
              </div>

              {selectedFiles.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {selectedFiles.map((file, i) => (
                    <div key={i} className="flex items-center gap-2 bg-muted px-3 py-1.5 rounded-md text-sm">
                      <span className="truncate max-w-[150px]" title={file.name}>{file.name}</span>
                      <button type="button" onClick={() => removeSelectedFile(i)} className="text-muted-foreground hover:text-destructive">
                        &times;
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex justify-between gap-4 sm:flex-row sm:items-end">
                <div className='flex item-center justtify-center  gap-2'>
                  <div className="grid w-full max-w-xs items-center gap-1.5">
                    <Label>Image Type</Label>
                    <Select value={imageType} onValueChange={(v) => setImageType(v as RepairCaseImageType)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="model_serial">Model / Serial</SelectItem>
                        <SelectItem value="repair_form">Repair Form</SelectItem>
                        <SelectItem value="before_repair">Before Repair</SelectItem>
                        <SelectItem value="after_repair">After Repair</SelectItem>
                        <SelectItem value="parts_components">Parts / Components</SelectItem>
                        <SelectItem value="warranty_invoice">Warranty Invoice</SelectItem>
                        <SelectItem value="shipping_fee_invoice">Shipping Fee Invoice</SelectItem>
                        <SelectItem value="repair_completion_receipt">Repair Completion Receipt</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid w-full max-w-2xl items-center gap-1.5">
                    <Label htmlFor="description">Description (optional)</Label>
                    <Input
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="E.g. front view"
                    />
                  </div>
                </div>
                <Button
                  type="submit"
                  disabled={selectedFiles.length === 0 || isUploading}
                  className="mt-2 sm:mt-0"
                >
                  {isUploading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <UploadCloud className="mr-2 h-4 w-4" />
                  )}
                  Upload {selectedFiles.length > 0 ? `(${selectedFiles.length})` : ''}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {!hideList && (
        <>
          {isLoading ? (
            <div className="flex justify-center p-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : images.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-12 text-center text-muted-foreground border rounded-lg border-dashed">
              <ImageIcon className="h-12 w-12 mb-4 opacity-20" />
              <p>No images found.</p>
              <p className="text-sm">Upload an image to see it here.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {displayedImages.map((image) => (
                <Card key={image.id} className="overflow-hidden group relative py-0 gap-4">
                  <div className="aspect-square relative bg-muted">
                    <img
                      src={getImageUrl(image.imagePath)}
                      alt={image.originalFilename}
                      className="object-cover w-full h-full"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => handleDelete(image.id)}
                        disabled={deleteMutation.isPending}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <CardContent className="p-3">
                    <div className="font-semibold text-sm truncate capitalize" title={image.imageType}>
                      {image.imageType.replace(/_/g, ' ')}
                    </div>
                    {image.description && (
                      <div className="text-xs text-muted-foreground truncate" title={image.description}>
                        {image.description}
                      </div>
                    )}
                    <div className="text-[10px] text-muted-foreground mt-1">
                      {new Date(image.uploadedAt).toLocaleString()}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Intersection observer target for infinite scroll */}
          {hasMore && (
            <div ref={observerRef} className="h-10 flex items-center justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          )}
        </>
      )}
    </div>
  )
}

import { useState, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@servexa-warranty-ai/ui/components/dialog'
import { Button } from '@servexa-warranty-ai/ui/components/button'
import { useImportModelMutation } from '../hooks/use-import-model-mutation'
import { toast } from 'sonner'
import { modelAPI } from '@/libs/api/product-catalog/model/api'
import {
  UploadCloud,
  FileSpreadsheet,
  Download,
  X,
  FileCheck2,
  Loader2,
} from 'lucide-react'
import { cn } from '@servexa-warranty-ai/ui/lib/utils'

type ProductsImportDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ProductsImportDialog({ open, onOpenChange }: ProductsImportDialogProps) {
  const { t } = useTranslation()
  const [file, setFile] = useState<File | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isDownloadingTemplate, setIsDownloadingTemplate] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const importMutation = useImportModelMutation()

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
  }

  const validateAndSetFile = (selectedFile: File) => {
    const validTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel',
    ]
    const validExtensions = ['.xlsx', '.xls']
    const isExtensionValid = validExtensions.some((ext) =>
      selectedFile.name.toLowerCase().endsWith(ext)
    )

    if (!validTypes.includes(selectedFile.type) && !isExtensionValid) {
      toast.error(t('Invalid file format. Please upload an Excel file (.xlsx or .xls)'))
      return
    }

    setFile(selectedFile)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndSetFile(e.target.files[0])
    }
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndSetFile(e.dataTransfer.files[0])
    }
  }

  const handleDownloadTemplate = async () => {
    try {
      setIsDownloadingTemplate(true)
      const blob = await modelAPI.downloadImportTemplate()
      if (blob) {
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = 'models-import-template.xlsx'
        document.body.appendChild(a)
        a.click()
        a.remove()
        window.URL.revokeObjectURL(url)
        toast.success(t('Template downloaded successfully'))
      } else {
        toast.error(t('Failed to download template'))
      }
    } catch (error) {
      toast.error(t('Error downloading template'))
    } finally {
      setIsDownloadingTemplate(false)
    }
  }

  const handleImport = () => {
    if (!file) {
      toast.error(t('Please select a file to import'))
      return
    }
    const formData = new FormData()
    formData.append('file', file)

    importMutation.mutate(formData, {
      onSuccess: () => {
        onOpenChange(false)
        setFile(null)
      },
      onError: () => {
        toast.error(t('Failed to import data'))
      },
    })
  }

  const handleReset = () => {
    setFile(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(state) => {
        if (!state) {
          handleReset()
        }
        onOpenChange(state)
      }}
    >
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{t('Import Models')}</DialogTitle>
          <DialogDescription>
            {t('Upload an Excel file (.xlsx or .xls) to bulk import product models.')}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-2">
          {/* Download Template Card Banner */}
          <div className="flex items-center justify-between gap-3 rounded-lg border bg-muted/30 p-3.5 text-sm">
            <div className="flex items-center gap-2.5 text-muted-foreground">
              <FileSpreadsheet className="h-5 w-5 shrink-0 text-emerald-600 dark:text-emerald-500" />
              <div>
                <p className="font-medium text-foreground">{t('Need the template?')}</p>
                <p className="text-xs">{t('Use our formatted sample file for best results')}</p>
              </div>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="gap-1.5 shrink-0"
              onClick={handleDownloadTemplate}
              disabled={isDownloadingTemplate}
            >
              {isDownloadingTemplate ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Download className="h-3.5 w-3.5 text-primary" />
              )}
              <span>{t('Download Template')}</span>
            </Button>
          </div>

          {/* Drag & Drop Zone */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => !file && fileInputRef.current?.click()}
            className={cn(
              'relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-6 text-center transition-all',
              file ? 'border-border bg-card' : 'cursor-pointer',
              isDragging
                ? 'border-primary bg-primary/10 ring-4 ring-primary/10'
                : !file && 'border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/30'
            )}
          >
            <input
              ref={fileInputRef}
              id="file"
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFileChange}
              className="hidden"
            />

            {!file ? (
              <div className="flex flex-col items-center justify-center gap-2 py-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <UploadCloud className="h-6 w-6" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">
                    <span className="text-primary hover:underline">{t('Click to upload')}</span>{' '}
                    {t('or drag and drop')}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {t('Excel spreadsheets (.xlsx, .xls) up to 10MB')}
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex w-full items-center justify-between gap-3 p-1">
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-500">
                    <FileSpreadsheet className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 text-left">
                    <p className="truncate text-sm font-medium text-foreground">{file.name}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{formatFileSize(file.size)}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-500 font-medium">
                        <FileCheck2 className="h-3 w-3" />
                        {t('Ready to import')}
                      </span>
                    </div>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 shrink-0 text-muted-foreground hover:text-destructive"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleReset()
                  }}
                >
                  <X className="h-4 w-4" />
                  <span className="sr-only">{t('Remove file')}</span>
                </Button>
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={importMutation.isPending}
          >
            {t('Cancel')}
          </Button>
          <Button
            onClick={handleImport}
            disabled={!file || importMutation.isPending}
            className="gap-2"
          >
            {importMutation.isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>{t('Importing...')}</span>
              </>
            ) : (
              <>
                <UploadCloud className="h-4 w-4" />
                <span>{t('Import')}</span>
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

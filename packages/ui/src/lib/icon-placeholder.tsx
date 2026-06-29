import React, { useMemo } from 'react'
import * as LucideIcons from 'lucide-react'
import { cn } from './utils'

interface IconPlaceholderProps {
    lucide?: string
    tabler?: string
    hugeicons?: string
    phosphor?: string
    remixicon?: string
    className?: string
    [key: string]: any
}

export function IconPlaceholder({
    lucide,
    tabler,
    hugeicons,
    phosphor,
    remixicon,
    className,
    ...props
}: IconPlaceholderProps) {
    const icon = useMemo(() => {
        // Try lucide first (most commonly available)
        if (lucide) {
            const Icon = (LucideIcons as unknown as Record<string, React.ElementType<any>>)[lucide]
            if (Icon) {
                return <Icon className={cn('inline-block', className)} {...props} />
            }
        }

        // Fallback to a generic placeholder if no icon found
        return (
            <div
                className={cn(
                    'inline-block rounded-full bg-muted',
                    className
                )}
                {...props}
            />
        )
    }, [lucide, className, props])

    return icon
}

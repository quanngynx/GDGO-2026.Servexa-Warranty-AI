import { Loader2Icon } from "lucide-react"
import type { LucideProps } from "lucide-react"

import { cn } from "@servexa-warranty-ai/ui/lib/utils"

function Spinner({ className, ...props }: LucideProps) {
    return (
        <Loader2Icon
            role="status"
            aria-label="Loading"
            className={cn("size-4 animate-spin", className)}
            {...props}
        />
    )
}

export { Spinner }

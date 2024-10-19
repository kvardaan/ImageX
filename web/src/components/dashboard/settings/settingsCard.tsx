import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

interface SettingsCardProps {
  header: string
  description: string | JSX.Element
  content: string | JSX.Element
  footer?: string | JSX.Element
  flexDirection?: string
}

export const SettingsCard = ({
  header,
  description,
  content,
  footer,
  flexDirection,
}: SettingsCardProps) => {
  return (
    <Card className="sm:w-2/3 bg-white dark:bg-black/50 ">
      <div className={`m-1 flex flex-${flexDirection} justify-between`}>
        <CardHeader>
          <CardTitle className="text-xl">{header}</CardTitle>
          <CardDescription className="text-black dark:text-white leading-7">
            {description}
          </CardDescription>
        </CardHeader>
        <CardContent>{content}</CardContent>
      </div>
      {footer && (
        <CardFooter className="flex flex-row items-center justify-center sm:justify-normal py-4 px-6 border-t bg-neutral-100 dark:bg-neutral-800/50 dark:border-white/10 text-black/50 dark:text-white/50 text-sm">
          {footer}
        </CardFooter>
      )}
    </Card>
  )
}

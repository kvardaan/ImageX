import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Transformations } from "@/components/protected/gallery/edit/editImage"

interface EditOptionsProps {
  transformations: Transformations
  handleTransformationChange: (key: string, value: any) => void
}

export const EditOptions = ({
  transformations,
  handleTransformationChange,
}: EditOptionsProps) => {
  return (
    <ScrollArea className="w-full h-full flex flex-col justify-between gap-y-4 p-4">
      <div className="space-y-4">
        {/* Resize */}
        <div className="flex flex-col gap-y-3">
          <Label>Resize</Label>
          <Slider
            value={[transformations.resize]}
            onValueChange={([value]) =>
              handleTransformationChange("resize", value)
            }
            max={200}
            step={1}
          />
        </div>

        {/* Rotate */}
        <div className="flex flex-col gap-y-3">
          <Label>Rotate</Label>
          <Slider
            value={[transformations.rotate]}
            onValueChange={([value]) =>
              handleTransformationChange("rotate", value)
            }
            max={360}
            step={15}
          />
        </div>

        {/* Watermark */}
        <div className="flex flex-col gap-y-3">
          <Label>Watermark</Label>
          <Input
            value={transformations.watermark}
            onChange={(e) =>
              handleTransformationChange("watermark", e.target.value)
            }
            placeholder="Enter watermark text"
          />
        </div>

        {/* Flip */}
        <div className="flex items-center justify-between">
          <Label htmlFor="flip">Flip</Label>
          <Switch
            id="flip"
            checked={transformations.flip}
            onCheckedChange={(checked) =>
              handleTransformationChange("flip", checked)
            }
          />
        </div>

        {/* Mirror */}
        <div className="flex items-center justify-between">
          <Label htmlFor="mirror">Mirror</Label>
          <Switch
            id="mirror"
            checked={transformations.mirror}
            onCheckedChange={(checked) =>
              handleTransformationChange("mirror", checked)
            }
          />
        </div>

        {/* Compress */}
        <div className="flex flex-col gap-y-3">
          <Label>Compress</Label>
          <Slider
            value={[transformations.compress]}
            onValueChange={([value]) =>
              handleTransformationChange("compress", value)
            }
            min={50}
            max={100}
            step={10}
          />
        </div>

        {/* Change Format */}
        <div className="flex flex-col gap-y-3">
          <Label>Format</Label>
          <Select
            value={transformations.format.split("/").pop() as string}
            onValueChange={(value) =>
              handleTransformationChange("format", `image/${value}`)
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select format" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="jpeg">JPEG</SelectItem>
              <SelectItem value="png">PNG</SelectItem>
              <SelectItem value="webp">WebP</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Apply Filters */}
        <div className="flex flex-col gap-y-3">
          <Label>Filter</Label>
          <Select
            value={transformations.filter}
            onValueChange={(value) =>
              handleTransformationChange("filter", value)
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">None</SelectItem>
              <SelectItem value="grayscale">Grayscale</SelectItem>
              <SelectItem value="sepia">Sepia</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </ScrollArea>
  )
}

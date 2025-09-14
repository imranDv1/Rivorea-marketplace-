"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Upload, X, GripVertical, Pencil, Loader2 } from "lucide-react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { toast } from "sonner";

type Thumb = { id: string; file: File };
type ProductFile = {
  id: string;
  file: File;
  name: string;
  isEditing?: boolean;
};

// --- SORTABLE THUMBNAIL ---
function SortableThumbnail({
  thumb,
  onRemove,
}: {
  thumb: Thumb;
  onRemove: (id: string) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: thumb.id });
  const style = { transform: CSS.Transform.toString(transform), transition };
  return (
    <div
      ref={setNodeRef}
      style={style}
      className="relative w-full h-48 rounded-md overflow-hidden border"
    >
      <img
        src={URL.createObjectURL(thumb.file)}
        alt="thumbnail"
        className="object-cover w-full h-full"
      />
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onRemove(thumb.id);
        }}
        className="absolute top-2 right-2 bg-black/50 text-white rounded-full p-1 hover:bg-black z-20"
      >
        <X className="w-4 h-4" />
      </button>
      <div
        {...attributes}
        {...listeners}
        className="absolute bottom-2 left-2 bg-black/60 text-white rounded px-2 py-1 cursor-move flex items-center z-10"
      >
        <GripVertical className="w-4 h-4 mr-1" />
        Drag
      </div>
    </div>
  );
}

// --- SORTABLE PRODUCT FILE ---
function SortableProductFile({
  item,
  onRemove,
  onRename,
  onStartEdit,
  onEndEdit,
}: {
  item: ProductFile;
  onRemove: (id: string) => void;
  onRename: (id: string, newName: string) => void;
  onStartEdit: (id: string) => void;
  onEndEdit: (id: string) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: item.id });
  const style = { transform: CSS.Transform.toString(transform), transition };
  return (
    <div
      ref={setNodeRef}
      style={style}
      className="relative flex items-center border rounded-md p-2 bg-[#111]"
    >
      <div
        {...attributes}
        {...listeners}
        className="mr-3 cursor-move flex items-center text-gray-500"
        title="Drag to reorder"
      >
        <GripVertical className="w-5 h-5" />
      </div>
      {item.isEditing ? (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onEndEdit(item.id);
          }}
          className="flex-1 flex items-center"
        >
          <Input
            className="w-full"
            autoFocus
            value={item.name}
            onChange={(e) => onRename(item.id, e.target.value)}
            onBlur={() => onEndEdit(item.id)}
          />
        </form>
      ) : (
        <div
          className="flex-1 flex items-center min-w-0"
          onDoubleClick={() => onStartEdit(item.id)}
        >
          <span className="truncate">{item.name}</span>
          <button
            type="button"
            className="ml-2 p-1 text-gray-400 hover:text-gray-700"
            onClick={() => onStartEdit(item.id)}
            title="Rename"
          >
            <Pencil className="w-4 h-4" />
          </button>
        </div>
      )}
      <button
        type="button"
        onClick={() => onRemove(item.id)}
        className="ml-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-700"
        title="Delete"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

function Page() {
  const [title, setTitle] = useState<string>("Untitled");
  const [description, setDescription] = useState<string>("");
  const [price, setPrice] = useState<number | "">("");
  const [category, setCategory] = useState<string>("");
  const [thumbnails, setThumbnails] = useState<Thumb[]>([]);
  const [productFiles, setProductFiles] = useState<ProductFile[]>([]);
  const sensors = useSensors(useSensor(PointerSensor));

  // Thumbnail Drop
  const onDropThumbnails = useCallback((acceptedFiles: File[]) => {
    const newThumbs = acceptedFiles.map((file) => ({
      id: crypto.randomUUID(),
      file,
    }));
    setThumbnails((prev) => [...prev, ...newThumbs].slice(0, 3));
  }, []);
  const {
    getRootProps: getThumbRoot,
    getInputProps: getThumbInput,
    isDragActive: isThumbActive,
  } = useDropzone({
    onDrop: onDropThumbnails,
    maxFiles: 3,
    maxSize: 1024 * 1024 * 5,
    accept: { "image/*": [".jpg", ".jpeg", ".png"] },
  });

  // Product File Drop
  const onDropFiles = useCallback((acceptedFiles: File[]) => {
    const newFiles = acceptedFiles.map((file) => ({
      id: crypto.randomUUID(),
      file,
      name: file.name,
      isEditing: false,
    }));
    setProductFiles((prev) => [...prev, ...newFiles].slice(0, 5));
  }, []);
  const {
    getRootProps: getFileRoot,
    getInputProps: getFileInput,
    isDragActive: isFileActive,
  } = useDropzone({
    onDrop: onDropFiles,
    maxFiles: 5,
    maxSize: 1024 * 1024 * 20,
    accept: {
      "application/zip": [".zip"],
      "application/pdf": [".pdf"],
      "application/octet-stream": [".exe"],
    },
  });

  // Product File actions
  const handleRemoveProductFile = (id: string) => {
    setProductFiles((prev) => prev.filter((f) => f.id !== id));
  };
  const handleRenameProductFile = (id: string, newName: string) => {
    setProductFiles((prev) =>
      prev.map((f) => (f.id === id ? { ...f, name: newName } : f))
    );
  };
  const handleStartEditProductFile = (id: string) => {
    setProductFiles((prev) =>
      prev.map((f) =>
        f.id === id ? { ...f, isEditing: true } : { ...f, isEditing: false }
      )
    );
  };
  const handleEndEditProductFile = (id: string) => {
    setProductFiles((prev) =>
      prev.map((f) => (f.id === id ? { ...f, isEditing: false } : f))
    );
  };

  const [loading, setLoading] = useState(false);

  // Submit Handler
  const handleSubmit = async () => {
      setLoading(true)

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("price", price.toString());
      formData.append("category", category);
      thumbnails.forEach((t) =>
        formData.append("thumbnails", t.file, t.file.name)
      );
      productFiles.forEach((f) =>
        formData.append("productFiles", f.file, f.name)
      );
      const res = await fetch("/api/products", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Product created successfully!");

        // Optionally: router.push("/dashboard/products") or reset form.
      } else {
        alert("Error: " + data.error);
      }
    } catch (err) {
     toast.error("error saving product"+ err)
      setLoading(false)


    }
      setLoading(false)

  };

  return (
    <div className="w-full mx-auto container gap-5 flex flex-col mt-10">
      <h1 className="text-4xl font-bold ml-4">{title}</h1>
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-bold">
            Create new Product
          </CardTitle>
          <CardDescription className="text-xl">
            Fill all inputs to make a new product
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Label className="text-2xl">Product name</Label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="!text-2xl !h-16 px-4"
          />
          <Label className="text-2xl">Product Description</Label>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="!text-2xl px-4 py-2"
          />
          <div className="grid grid-cols-2 gap-4">
            <Label className="text-2xl">Category</Label>
            <Label className="text-2xl">Price</Label>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Select onValueChange={(val) => setCategory(val)}>
              <SelectTrigger className="w-full py-7 text-2xl">
                <SelectValue placeholder="Product type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ui-kit" className="text-2xl">
                  UI Kit
                </SelectItem>
                <SelectItem value="icons" className="text-2xl">
                  Icons
                </SelectItem>
              </SelectContent>
            </Select>
            <Input
              type="number"
              placeholder="price"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              className="!h-14.5 !text-2xl px-4"
            />
          </div>
          {/* THUMBNAILS */}
          <Label className="text-2xl">Product Thumbnails (max 3)</Label>
          <Card
            className={cn(
              "relative border-2 border-dashed border-primary transition-colors duration-200 ease-in-out w-full min-h-64"
            )}
            {...getThumbRoot()}
          >
            <CardContent className="flex flex-col items-center justify-center h-full w-full">
              <input {...getThumbInput()} />
              {thumbnails.length > 0 ? (
                <DndContext
                  collisionDetection={closestCenter}
                  sensors={sensors}
                  onDragEnd={({ active, over }) => {
                    if (over && active.id !== over.id) {
                      const oldIndex = thumbnails.findIndex(
                        (t) => t.id === active.id
                      );
                      const newIndex = thumbnails.findIndex(
                        (t) => t.id === over.id
                      );
                      setThumbnails((items) =>
                        arrayMove(items, oldIndex, newIndex)
                      );
                    }
                  }}
                >
                  <SortableContext
                    items={thumbnails.map((t) => t.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    <div className="grid grid-cols-3 gap-3 w-full p-2">
                      {thumbnails.map((thumb) => (
                        <SortableThumbnail
                          key={thumb.id}
                          thumb={thumb}
                          onRemove={(id) =>
                            setThumbnails((prev) =>
                              prev.filter((t) => t.id !== id)
                            )
                          }
                        />
                      ))}
                    </div>
                  </SortableContext>
                </DndContext>
              ) : isThumbActive ? (
                <div className="w-full h-full flex items-center justify-center bg-[#ffcd8389]">
                  <p>Drop here</p>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full w-full gap-y-3">
                  <Upload className="size-11 text-primary" />
                  <Button>Select Thumbnails</Button>
                </div>
              )}
            </CardContent>
          </Card>
          {/* PRODUCT FILES */}
          <Label className="text-2xl">
            Product Files (max 5, drag to reorder, double-click to rename)
          </Label>
          <Card
            className={cn(
              "relative border-2 border-dashed border-primary transition-colors duration-200 ease-in-out w-full h-64"
            )}
            {...getFileRoot()}
          >
            <CardContent className="flex flex-col items-center justify-center h-full w-full">
              <input {...getFileInput()} />
              {isFileActive ? (
                <div className="w-full h-full flex items-center justify-center bg-[#ffcd8389]">
                  <p>Drop files here</p>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full w-full gap-y-3">
                  <Upload className="size-11 text-primary" />
                  <Button>Select Files</Button>
                </div>
              )}
            </CardContent>
          </Card>
          {productFiles.length > 0 && (
            <div className="flex flex-col gap-2 w-full mt-2">
              <DndContext
                collisionDetection={closestCenter}
                sensors={sensors}
                onDragEnd={({ active, over }) => {
                  if (over && active.id !== over.id) {
                    const oldIndex = productFiles.findIndex(
                      (f) => f.id === active.id
                    );
                    const newIndex = productFiles.findIndex(
                      (f) => f.id === over.id
                    );
                    setProductFiles((items) =>
                      arrayMove(items, oldIndex, newIndex)
                    );
                  }
                }}
              >
                <SortableContext
                  items={productFiles.map((f) => f.id)}
                  strategy={verticalListSortingStrategy}
                >
                  {productFiles.map((item) => (
                    <SortableProductFile
                      key={item.id}
                      item={item}
                      onRemove={handleRemoveProductFile}
                      onRename={handleRenameProductFile}
                      onStartEdit={handleStartEditProductFile}
                      onEndEdit={handleEndEditProductFile}
                    />
                  ))}
                </SortableContext>
              </DndContext>
            </div>
          )}
          {loading ? (
            <>
              <Button className="mt-4 py-6 text-xl font-bold" disabled>
                <Loader2 className="size-4 animate-spin" />
                Saving Product...
              </Button>
            </>
          ) : (
            <>
              <Button
                onClick={handleSubmit}
                className="mt-4 py-6 text-xl font-bold"
              >
                Save Product
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default Page;

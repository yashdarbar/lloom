"use client";

import { Chapter } from "@/src/app/generated/client";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import {
    DragDropContext,
    Droppable,
    Draggable,
    DropResult,
} from "@hello-pangea/dnd";
import { Grip, Pencil } from "lucide-react";

interface ChaptersListProps {
    onEdit: (id: string) => void;
    onReorder: (updateData: { id: string; position: number }[]) => void;
    items: Chapter[];
}

const ChaptersList = ({ onEdit, onReorder, items }: ChaptersListProps) => {
    const [isMounted, setIsMounted] = useState(false);
    const [chapters, setChapters] = useState(items);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        setChapters(items);
    }, [items]);

    const onDragEnd = (result: DropResult) => {
        if (!result.destination) return

        const items = Array.from(chapters);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);

        const startIndex = Math.min(result.source.index, result.destination.index);
        const endIndex = Math.max(result.source.index, result.destination.index);

        const updatedChapters = items.slice(startIndex, endIndex + 1);

        setChapters(items);

        const bulkUpdateData = updatedChapters.map((chapter)=>({
            id: chapter.id,
            position: items.findIndex((item)=> item.id === chapter.id)
        }));

        onReorder(bulkUpdateData);
    }

    if (!isMounted) {
        return null;
    }

    return (
        <div>
            <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="chapters">
                    {(provided) => (
                        <div
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                        >
                            {chapters.map((chapter, index) => (
                                <Draggable
                                    key={chapter.id}
                                    index={index}
                                    draggableId={chapter.id}
                                >
                                    {(provided) => (
                                        <div
                                            className={cn(
                                                "flex items-center gap-x-2 mb-4 rounded-md bg-slate-200 border-slate-200 text-sm text-slate-700 dark:bg-black dark:border dark:border-slate-600",
                                                chapter.isPublished &&
                                                    "text-sky-700 bg-sky-100"
                                            )}
                                            {...provided.draggableProps}
                                            ref={provided.innerRef}
                                        >
                                            <div
                                                className={cn(
                                                    "px-2 py-3 border-r border-r-slate-200 hover:bg-slate-300 rounded-l-md transition dark:border-r-slate-600 dark:border-r",
                                                    chapter.isPublished &&
                                                        "border-r-sky-200 hover:bg-sky-200"
                                                )}
                                                {...provided.dragHandleProps}
                                            >
                                                <Grip className="h-4 w-4" />
                                            </div>
                                            <div className="dark:text-white">
                                                {chapter.title}
                                            </div>
                                            <div className="ml-auto flex pr-2 items-center gap-x dark:bg-black">
                                                {chapter.isFree && (
                                                    <Badge className="mr-2">Free</Badge>
                                                )}
                                                <Badge
                                                    className={cn(
                                                        "bg-slate-500",
                                                        chapter.isPublished &&
                                                            "bg-sky-500 dark:bg-slate-600"
                                                    )}
                                                >
                                                    {chapter.isPublished
                                                        ? "Published"
                                                        : "Draft"}
                                                </Badge>
                                                <Pencil
                                                    onClick={() =>
                                                        onEdit(chapter.id)
                                                    }
                                                    className="ml-2 h-4 w-4 cursor-pointer hover:opacity-75 transition dark:text-white"
                                                />
                                            </div>
                                        </div>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>
        </div>
    );
};


export default ChaptersList;

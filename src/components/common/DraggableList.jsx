import React from 'react';
import { 
  DndContext, 
  closestCenter, 
  KeyboardSensor, 
  PointerSensor, 
  useSensor, 
  useSensors,
  DragOverlay
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import '../../styles/DraggableForm.css';

/**
 * A wrapper component for a sortable item
 */
export const SortableItem = ({ id, children }) => {
  const { 
    attributes, 
    listeners, 
    setNodeRef, 
    transform, 
    transition,
    isDragging
  } = useSortable({ id });
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  
  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      {...attributes} 
      {...listeners}
      className={`draggable-item ${isDragging ? 'dragging' : ''}`}
    >
      {children}
    </div>
  );
};

/**
 * A component for creating a draggable list of items
 * @param {Object} props Component props
 * @param {Array} props.items The array of items to be sorted
 * @param {Function} props.onReorder Callback function when items are reordered
 * @param {Function} props.renderItem Function to render each item given an item and its index
 * @param {Function} props.getItemId Function to get the ID of an item (defaults to using the index)
 */
const DraggableList = ({ 
  items, 
  onReorder, 
  renderItem, 
  getItemId = (_, index) => index 
}) => {
  const [activeId, setActiveId] = React.useState(null);
  
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Minimum distance to start dragging (prevents accidental drags)
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );
  
  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };
  
  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveId(null);
    
    if (over && active.id !== over.id) {
      const oldIndex = items.findIndex((item, index) => 
        getItemId(item, index) === active.id
      );
      
      const newIndex = items.findIndex((item, index) => 
        getItemId(item, index) === over.id
      );
      
      // Create a new array with the item moved to the new position
      const newItems = [...items];
      const [movedItem] = newItems.splice(oldIndex, 1);
      newItems.splice(newIndex, 0, movedItem);
      
      onReorder(newItems);
    }
  };
  
  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={items.map((item, index) => getItemId(item, index))}
        strategy={verticalListSortingStrategy}
      >
        {items.map((item, index) => (
          <SortableItem key={getItemId(item, index)} id={getItemId(item, index)}>
            {renderItem(item, index)}
          </SortableItem>
        ))}
      </SortableContext>
      <DragOverlay>
        {activeId !== null && items.length > 0 && (
          <div className="dragging">
            {renderItem(
              items[items.findIndex((item, index) => getItemId(item, index) === activeId)],
              items.findIndex((item, index) => getItemId(item, index) === activeId)
            )}
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );
};

export default DraggableList;
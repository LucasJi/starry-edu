'use client';
import { MenuOutlined } from '@ant-design/icons';
import type { DragEndEvent } from '@dnd-kit/core';
import { DndContext } from '@dnd-kit/core';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Button, Table } from 'antd';
import React, { FC, useId } from 'react';

interface RowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  'data-row-key': string;
}

const Row = ({ children, ...props }: RowProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: props['data-row-key'],
  });

  const style: React.CSSProperties = {
    ...props.style,
    transform: CSS.Transform.toString(transform && { ...transform, scaleY: 1 }),
    transition,
    ...(isDragging ? { position: 'relative', zIndex: 9999 } : {}),
  };

  return (
    <tr {...props} ref={setNodeRef} style={style} {...attributes}>
      {React.Children.map(children, child => {
        if ((child as React.ReactElement).key === 'sort') {
          return React.cloneElement(child as React.ReactElement, {
            children: (
              <MenuOutlined
                ref={setActivatorNodeRef}
                style={{ touchAction: 'none', cursor: 'move' }}
                {...listeners}
              />
            ),
          });
        }
        return child;
      })}
    </tr>
  );
};

const SortableList: FC<{
  list: any[];
  onChange?: (list: any[]) => void;
  nameColumnRender?: (record: any) => string;
  emptyText?: string;
  className?: string;
}> = ({
  list,
  onChange = () => {},
  emptyText = '无数据',
  className = '',
  nameColumnRender,
}) => {
  const id = useId();
  const onDragEnd = ({ active, over }: DragEndEvent) => {
    if (active.id !== over?.id) {
      const activeIndex = list.findIndex(i => i.id === active.id);
      const overIndex = list.findIndex(i => i.id === over?.id);
      onChange(arrayMove(list, activeIndex, overIndex));
    }
  };

  const onDelete = (id: number) => {
    onChange(list.filter(i => i.id !== id));
  };

  return (
    <DndContext
      id={id}
      modifiers={[restrictToVerticalAxis]}
      onDragEnd={onDragEnd}
    >
      <SortableContext
        // rowKey array
        items={list.map(i => i.id!)}
        strategy={verticalListSortingStrategy}
      >
        <Table
          className={className}
          locale={{ emptyText }}
          size="middle"
          showHeader={false}
          components={{
            body: {
              row: Row,
            },
          }}
          rowKey="id"
          columns={[
            {
              key: 'sort',
              width: '4rem',
            },
            nameColumnRender
              ? {
                  render: (_, record) => nameColumnRender(record),
                  width: '10rem',
                }
              : {
                  key: 'name',
                  dataIndex: 'name',
                  width: '10rem',
                },
            {
              key: 'action',
              width: '4rem',
              render: (_, record) => (
                <Button onClick={() => onDelete(record.id!)}>移除</Button>
              ),
            },
          ]}
          dataSource={list}
          pagination={false}
        />
      </SortableContext>
    </DndContext>
  );
};

export default SortableList;

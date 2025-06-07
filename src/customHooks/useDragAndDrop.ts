import { useState, useEffect } from "react";

export const useDragAndDrop = (teams: any[]) => {
  const [teamOrder, setTeamOrder] = useState<string[]>([]);

  useEffect(() => {
    if (teams.length && teamOrder.length === 0) {
      setTeamOrder(teams.map((t: any) => t.team.id));
    }
  }, [teams, teamOrder.length]);

  const onDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData("text/plain", id);
  };

  const onDrop = (e: React.DragEvent, dropId: string) => {
    const draggedId = e.dataTransfer.getData("text/plain");
    if (draggedId === dropId) return;

    const newOrder = [...teamOrder];
    const draggedIndex = newOrder.indexOf(draggedId);
    const dropIndex = newOrder.indexOf(dropId);

    newOrder.splice(draggedIndex, 1);
    newOrder.splice(dropIndex, 0, draggedId);
    setTeamOrder(newOrder);
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  return {
    teamOrder,
    setTeamOrder,
    onDragStart,
    onDrop,
    onDragOver,
  };
};

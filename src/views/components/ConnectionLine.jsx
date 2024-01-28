const ConnectionLine = ({ from, to, draggedComponents }) => {
  if (!from || !to) return null;

  const [sourceIndex, sourceConnectorType] = from.from.split('_').slice(0, 3).map(Number);
  const [targetIndex, targetConnectorType] = from.to.split('_').slice(0, 3).map(Number);

  const fromElement = document.getElementById(
    `${sourceIndex}_${draggedComponents[sourceIndex].type}_item_${sourceConnectorType}_connector`
  );

  const toElement = document.getElementById(
    `${targetIndex}_${draggedComponents[targetIndex].type}_item_${targetConnectorType}_connector`
  );

  if (!fromElement || !toElement) return null;

  const fromRect = fromElement.getBoundingClientRect();
  const toRect = toElement.getBoundingClientRect();

  const fromX = fromRect.left + fromRect.width / 2;
  const fromY = fromRect.top + fromRect.height / 2;

  const toX = toRect.left + toRect.width / 2;
  const toY = toRect.top + toRect.height / 2;

  return (
    <svg
      style={{ position: 'absolute', zIndex: 1 }}
      width="100%"
      height="100%"
      xmlns="http://www.w3.org/2000/svg"
    >
      <line x1={fromX} y1={fromY} x2={toX} y2={toY} stroke="#000" strokeWidth="2" />
    </svg>
  );
};


export default ConnectionLine
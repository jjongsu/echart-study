export default class DragEventClass {
    onLoad() {
        document.addEventListener('DOMContentLoaded', () => {
            const gridItems = document.querySelectorAll('.grid-item');

            gridItems.forEach((item) => {
                item.setAttribute('draggable', 'true');

                item.addEventListener('dragstart', (e) => {
                    e.dataTransfer.setData('text/plain', e.target.id);
                    e.target.classList.add('dragging');
                });

                item.addEventListener('dragover', (e) => {
                    e.preventDefault(); // 필수: 드롭 허용
                    e.dataTransfer.dropEffect = 'move';
                    item.classList.add('drag-over');
                });

                item.addEventListener('dragleave', () => {
                    item.classList.remove('drag-over');
                });

                item.addEventListener('drop', (e) => {
                    e.preventDefault();
                    item.classList.remove('drag-over');

                    const draggedId = e.dataTransfer.getData('text/plain');
                    const draggedEl = document.getElementById(draggedId);

                    if (draggedEl !== item) {
                        // 두 요소의 위치를 바꿈
                        const droppedOnParent = item.parentNode;
                        const draggedClone = draggedEl.cloneNode(true);
                        const targetClone = item.cloneNode(true);

                        // Replace both elements with clones
                        droppedOnParent.replaceChild(draggedClone, item);
                        droppedOnParent.replaceChild(targetClone, draggedEl);

                        // 다시 드래그 이벤트를 바인딩
                        setDragEvents();
                    }
                });

                item.addEventListener('dragend', () => {
                    item.classList.remove('dragging');
                });
            });

            function setDragEvents() {
                // 위 로직을 다시 등록할 수 있도록 재귀적으로 바인딩
                document.querySelectorAll('.grid-item').forEach((el) => {
                    el.replaceWith(el.cloneNode(true));
                });
                // 다시 초기화
                document.querySelectorAll('.grid-item').forEach((el) => el.removeAttribute('draggable'));
                // 재바인딩
                document.dispatchEvent(new Event('DOMContentLoaded'));
            }
        });
    }
}

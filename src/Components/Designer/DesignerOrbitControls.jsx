export const DesignerOrbitControls = () => {
    return <div id="gizmo-controls"
                style={{
                    position: 'fixed',
                    bottom: '20px',
                    right: '20px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center'
                }}>
        <button id="view-top">TOP</button>
        <button id="view-3d">3D</button>
        <button id="zoom-in">+</button>
        <button id="zoom-out">-</button>
    </div>
}
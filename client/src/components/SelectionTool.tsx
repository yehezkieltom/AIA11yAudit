import { Stage, Layer, Rect, Image as KonvaImage, Transformer as KonvaTransformer} from 'react-konva';
import { useState, useRef, useEffect } from 'react';
import useImage from 'use-image';
import "konva/lib/shapes/Image"; 
import './SelectionTool.css';
import Konva from 'konva';
import { Transform } from 'konva/lib/Util';

const SelectionTool  = ({ imgSrc, onSelect, onUpdate, isSelecting, markedAreas }: 
    {imgSrc: string; onSelect: (data:any) => void; onUpdate: (index: number, updatedProps: {x?: number; y?: number; width?: number; height?: number}) => void; isSelecting: boolean; markedAreas: {x:number; y:number; width: number; height: number}[]}) => {
    const [rect, setRect] = useState({x:0, y:0, width:0, height:0});
    const [isDrawing, setIsDrawing] = useState(false);
    const [canvaImg, setCanvasImg] = useState<any>(null);
    const [selectedRect, setSelectedRect] = useState<string | null>(null);
    const [image] = useImage(imgSrc);
    const transform = useRef<Konva.Transformer>(null);

    useEffect(() => {
        if (transform.current && selectedRect !== null) {
            const transformer = transform.current;
            const stage = transformer.getStage();
            const selectedNode = stage?.findOne(`'${selectedRect}`); 
            if(selectedNode) {
                transformer.nodes([selectedNode]);
                transformer.getLayer()?.batchDraw();
            } else {
                transformer.nodes([]);
            }
        }
    }, [selectedRect]);

    const handleMouseDown = (e: any) => {
        if(!isSelecting) {
             return;
        };
        const { x, y } = e.target.getStage().getPointerPosition();
        setRect({ x, y, width: 0, height: 0 });
        setIsDrawing(true);
    };

    const handleMouseMove = (e: any) => {
        if (!isDrawing || !rect) {
            return;
        };
        const { x, y } = e.target.getStage().getPointerPosition();
        setRect( (prev) => ({...prev, width: x - prev.x, height: y - prev.y}));
    };

    const handleMouseUp = () => {
        if (!isDrawing) {
            return;
        };
        setIsDrawing(false);
        onSelect(rect);
    };

    const handleDragMove = (e: any, index: number) => {
        const { x, y } = e.target.position();
        onUpdate(index, { x, y });
    };

    const handleTransformation = (e: any, index: number) => {
        const node = e.target;
        const newX = node.x();
        const newY = node.y();
        const newWidth = Math.max(20, node.width() * node.scaleX());
        const newHeight = Math.max(20, node.height() * node.scaleY());

        node.scaleX(1);
        node.scaleY(1);

        onUpdate(index, { x: newX, y: newY, width: newWidth, height: newHeight });
    };

    return (
        <div className="konva-container">
            <Stage  width={Math.min(window.innerWidth * 0.75, 1000)}
                    height={Math.min(window.innerHeight * 0.7, 500)}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
            >
                <Layer>
                    {image && <KonvaImage image={image}
                        width={Math.min(window.innerWidth * 0.7, 1000)}
                        height={Math.min(window.innerHeight * 0.6, 500)}
                        x={(Math.min(window.innerWidth * 0.75, 900) - Math.min(window.innerWidth * 0.7, 900)) / 2}
                        y={(Math.min(window.innerHeight * 0.6, 500) - Math.min(window.innerHeight * 0.6, 500)) / 2}
                    />}
                    {markedAreas.map((area, index) => (
                        <Rect key={index} id={`rect-${index}`} {...area} strokeWidth={2} stroke="red" 
                            draggable onClick={() => setSelectedRect(`rect-${index}`)}
                            onDragEnd={(e) => handleDragMove(e, index)}
                            onTransformEnd={(e) => handleTransformation(e, index)}
                            />
                    ))}
                    {isDrawing && <Rect {...rect} fill="rgba(0,0,255,0.3)" stroke="blue" />}

                    <KonvaTransformer ref={transform} />
                </Layer>
            </Stage>
        </div>
    );
};

export default SelectionTool;
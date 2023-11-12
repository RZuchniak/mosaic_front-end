import { useRef, useEffect, useTransition, useState } from 'react';
import './Canvas.css';

type CanvasProps = React.DetailedHTMLProps<
React.CanvasHTMLAttributes<HTMLCanvasElement>,
HTMLCanvasElement>;

const Canvas: React.FC<CanvasProps> = ({ ...props }) => {
    
    enum Colour  {
        Red = 'red',
        Blue = 'blue',
        Green = 'green',
        LightBlue = 'lightblue',
    }

    let board = Array(1000).fill(Array(1000).fill(Colour.Red));

    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    const [zoom, setzoom] = useState(1)

    const [locationx, setlocationx] = useState(0);
    const [locationy, setlocationy] = useState(0);

    useEffect(() => {
        console.log("1: " + zoom)
        setzoom(props.results || 1);
        console.log("2: " + zoom);
    }, [props.results])

    useEffect(() => {
        const move = (e: MouseEvent) => {
            if(e.buttons === 2){
                console.log(e.clientX, e.clientY, "move");
                const canvas = canvasRef.current;
                if(!canvas) {
                    return;
                }
                setlocationx(Math.max(0, Math.min((locationx + (e.movementX/zoom)) , 1000)))
                setlocationy(Math.max(-100, Math.min((locationy + (e.movementY/zoom)) , 500)))
                console.log(zoom);
                console.log(locationx);
                canvas.style.transform = `translate(${locationx}px, ${locationy}px)`
            }
        }
        const contextMenu = (e: Event) => {
            e.preventDefault();
        }


        window.addEventListener('mousemove', move);
        window.addEventListener('contextmenu', contextMenu);
        
        return () => {
          window.removeEventListener('mousemove', move);
          window.removeEventListener('contextmenu', contextMenu);
        }
      }, [zoom]);


    const click = (e: any) => {
        
        const canvas = canvasRef.current;
        if(!canvas) {
            return;
        }
        const context = canvas.getContext('2d')
        if(!context) {
            return;
        }
        const x = e.clientX;
        const y = e.clientY;

        const rect = canvas.getBoundingClientRect();
        const x1 = ((x) - (rect.left))/zoom;
        const y1 = ((y) - (rect.top))/zoom;
        context.fillStyle = 'blue';
        context.fillRect(x1, y1, 5, 5);

        board[Math.round(x1)][Math.round(y1)] = Colour.Blue;
        
    }

    

    useEffect(() => {
        console.log("start");
        const canvas = canvasRef.current;
        if(!canvas) {
            return;
        }
        const context = canvas.getContext('2d');
        if(!context) {
            return;
        }
        context.fillStyle = 'red';
        let a = 0;
        let b = 0;
        while (a<Number(props.width)) {
            while (b<Number(props.height)) {
                context.fillStyle = board[a][b];
                context.fillRect(a, b, 1, 1);
                b+=1;
            }
            b=0;
            a+=1;
        }

    }, []);


    return <canvas onClick={click} width={props.width} height={props.height} ref={canvasRef}/>
};

export default Canvas;
document.addEventListener("DOMContentLoaded",app);

function app() {
    let C = document.querySelector("canvas"),
        c = C.getContext("2d"),
        W = 600,
        H = 600,
        centerX = W / 2,
        centerY = H / 2,
        S = window.devicePixelRatio;
    // properly scale the canvas based on pixel ratio
    C.width = W * S;
    C.height = H * S;

    if (S > 1) {
        C.style.width = `${W}px`;
        C.style.height = `${H}px`;
        c.scale(S,S);
    }

    let frame = 0,
        frames = 360,
        speed = 1.5,
        hue = 0,
        baseRingRadius = 64,
        baseRingsInGroup = 6,
        ringGroups = 8,
        ringGroupRadiusOffset = 14,
        ringGroupRotOffset = 30,
        degToRad = deg => {
            return deg * Math.PI / 180;
        },
        draw = () => {
            c.clearRect(0,0,W,H);

            for (let g = 1; g <= ringGroups; ++g) {
                // determine the radius of the ring group
                let sectors = baseRingsInGroup * 2**(g - 1),
                    ringRadius = baseRingRadius / g,
                    groupRadius = baseRingRadius;

                for (let m = 1; m < g; ++m)
                    groupRadius += baseRingRadius / m;
                // ring texture
                let adjGroupRadius = ringGroupRadiusOffset + groupRadius,
                    texture = c.createLinearGradient(0,-ringRadius,0,ringRadius);

                texture.addColorStop(0,`hsl(${hue},90%,75%)`);
                texture.addColorStop(0.33,`hsl(${hue},90%,55%)`);
                texture.addColorStop(1,`hsla(${hue},90%,55%,0)`);
                c.strokeStyle = texture;
                // draw each ring
                for (let s = 0; s < sectors; ++s) {
                    let sectorAngle = 360 / sectors,
                        rotAmount = ringGroupRotOffset + sectorAngle * s,
                        sectorX = centerX + adjGroupRadius * Math.sin(degToRad(rotAmount)),
                        sectorY = centerY + adjGroupRadius * Math.cos(degToRad(rotAmount));

                    c.save();
                    c.translate(sectorX,sectorY);
                    c.rotate(degToRad(-rotAmount + frame));
                    c.beginPath();
                    c.arc(0,0,ringRadius,Math.PI * 0.5,Math.PI * 1.5);
                    c.stroke();
                    c.closePath();
                    c.restore();
                }
            }
            nextFrame();
        },
        nextFrame = () => {
            frame += speed;
            hue = frame;

            if (frame >= frames)
                frame = 0;
        },
        run = () => {
            draw();
            requestAnimationFrame(run);
        };

    run();
}
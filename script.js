        (function() {
            const canvas = document.getElementById('bg-canvas');
            const titleText = document.getElementById('titleText');
            const langLabel = document.getElementById('langLabel');
            const progressPercent = document.getElementById('progressPercent');
            const progressFill = document.getElementById('progressFill');
            const notifyBtn = document.getElementById('notifyBtn');
            const emailInput = document.querySelector('.email-input');

            // Multi-language data (including Nepali)
            const languages = [
                { text: 'Under Construction', lang: 'English', flag: '🇬🇧' },
                { text: 'En Construcción', lang: 'Español', flag: '🇪🇸' },
                { text: 'En Construction', lang: 'Français', flag: '🇫🇷' },
                { text: 'Im Aufbau', lang: 'Deutsch', flag: '🇩🇪' },
                { text: '工事中', lang: '日本語', flag: '🇯🇵' },
                { text: '建设中', lang: '中文', flag: '🇨🇳' },
                { text: 'قيد الإنشاء', lang: 'العربية', flag: '🇸🇦' },
                { text: 'В разработке', lang: 'Русский', flag: '🇷🇺' },
                { text: 'निर्माणाधीन', lang: 'हिन्दी', flag: '🇮🇳' },
                { text: 'निर्माणाधीन', lang: 'नेपाली', flag: '🇳🇵' },
                { text: 'Em Construção', lang: 'Português', flag: '🇧🇷' },
                { text: 'In Costruzione', lang: 'Italiano', flag: '🇮🇹' },
                { text: 'Under uppbyggnad', lang: 'Svenska', flag: '🇸🇪' },
            ];

            let currentLangIndex = 0;
            titleText.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
            langLabel.style.transition = 'opacity 0.4s ease';

            function cycleLanguage() {
                titleText.style.opacity = '0';
                titleText.style.transform = 'translateY(-8px)';
                langLabel.style.opacity = '0';
                setTimeout(() => {
                    currentLangIndex = (currentLangIndex + 1) % languages.length;
                    const lang = languages[currentLangIndex];
                    titleText.textContent = lang.text;
                    langLabel.textContent = lang.flag + ' ' + lang.lang;
                    titleText.style.opacity = '1';
                    titleText.style.transform = 'translateY(0)';
                    langLabel.style.opacity = '1';
                }, 400);
            }
            setInterval(cycleLanguage, 3500);

            // Notify button
            notifyBtn.addEventListener('click', () => {
                const email = emailInput.value.trim();
                if (email && email.includes('@') && email.includes('.')) {
                    notifyBtn.textContent = '✓ Subscribed!';
                    notifyBtn.style.background = 'linear-gradient(135deg, #22c55e, #16a34a)';
                    notifyBtn.style.pointerEvents = 'none';
                    emailInput.value = '';
                    emailInput.style.borderColor = 'rgba(34,197,94,0.5)';
                    emailInput.style.boxShadow = '0 0 20px rgba(34,197,94,0.2)';
                    setTimeout(() => {
                        notifyBtn.textContent = 'Notify Me';
                        notifyBtn.style.background = 'linear-gradient(135deg, #00d4ff, #0088aa)';
                        notifyBtn.style.pointerEvents = 'all';
                        emailInput.style.borderColor = 'rgba(255,255,255,0.18)';
                        emailInput.style.boxShadow = 'none';
                    }, 2800);
                } else {
                    emailInput.style.borderColor = '#ff6b6b';
                    emailInput.style.boxShadow = '0 0 16px rgba(255,107,107,0.35)';
                    emailInput.style.animation = 'shake 0.5s ease';
                    setTimeout(() => {
                        emailInput.style.borderColor = 'rgba(255,255,255,0.18)';
                        emailInput.style.boxShadow = 'none';
                        emailInput.style.animation = '';
                    }, 600);
                }
            });

            // Shake animation injection
            const shakeStyle = document.createElement('style');
            shakeStyle.textContent = `
                @keyframes shake {
                    0%,100% { transform: translateX(0); }
                    20% { transform: translateX(-6px); }
                    40% { transform: translateX(6px); }
                    60% { transform: translateX(-4px); }
                    80% { transform: translateX(4px); }
                }`;
            document.head.appendChild(shakeStyle);

            // THREE.JS SCENE
            if (typeof THREE === 'undefined') {
                console.warn('Three.js not loaded.');
                return;
            }

            const scene = new THREE.Scene();
            const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 50);
            camera.position.set(0, 0.3, 7.5);
            camera.lookAt(0, 0, 0);
            const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
            renderer.setSize(window.innerWidth, window.innerHeight);
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
            renderer.toneMapping = THREE.ACESFilmicToneMapping;
            renderer.toneMappingExposure = 1.2;

            scene.add(new THREE.AmbientLight(0x1a2a4a, 0.6));

            // Stars
            const starsCount = 1200;
            const starsGeom = new THREE.BufferGeometry();
            const starsPos = new Float32Array(starsCount * 3);
            for (let i = 0; i < starsCount; i++) {
                const theta = Math.random() * Math.PI * 2;
                const phi = Math.acos(2 * Math.random() - 1);
                const r = 8 + Math.random() * 18;
                starsPos[i*3] = r * Math.sin(phi) * Math.cos(theta);
                starsPos[i*3+1] = r * Math.sin(phi) * Math.sin(theta);
                starsPos[i*3+2] = r * Math.cos(phi);
            }
            starsGeom.setAttribute('position', new THREE.BufferAttribute(starsPos, 3));
            const spriteCanvas = document.createElement('canvas');
            spriteCanvas.width = 64; spriteCanvas.height = 64;
            const ctx = spriteCanvas.getContext('2d');
            const grad = ctx.createRadialGradient(32,32,0,32,32,32);
            grad.addColorStop(0,'rgba(255,255,255,1)');
            grad.addColorStop(0.08,'rgba(220,240,255,0.9)');
            grad.addColorStop(0.3,'rgba(150,210,255,0.5)');
            grad.addColorStop(0.6,'rgba(50,130,200,0.1)');
            grad.addColorStop(1,'rgba(0,0,0,0)');
            ctx.fillStyle = grad;
            ctx.fillRect(0,0,64,64);
            const spriteTex = new THREE.CanvasTexture(spriteCanvas);
            const starsMat = new THREE.PointsMaterial({ map: spriteTex, color:0xccddff, size:0.25, blending:THREE.AdditiveBlending, depthWrite:false, transparent:true, opacity:0.75 });
            const stars = new THREE.Points(starsGeom, starsMat);
            scene.add(stars);

            // Globe
            const globeGroup = new THREE.Group();
            scene.add(globeGroup);
            const GLOBE_RADIUS = 1.55;
            const sphereGeom = new THREE.SphereGeometry(GLOBE_RADIUS, 72, 48);
            const cloudGeom = new THREE.BufferGeometry();
            cloudGeom.setAttribute('position', new THREE.BufferAttribute(new Float32Array(sphereGeom.getAttribute('position').array), 3));
            const cloudMat = new THREE.PointsMaterial({ map: spriteTex, color:0x00d4ff, size:0.06, blending:THREE.AdditiveBlending, depthWrite:false, transparent:true, opacity:0.85 });
            globeGroup.add(new THREE.Points(cloudGeom, cloudMat));

            const nodesCount = 180;
            const nodesGeom = new THREE.BufferGeometry();
            const nodesArr = new Float32Array(nodesCount*3);
            for (let i=0; i<nodesCount; i++) {
                const theta = Math.random()*Math.PI*2;
                const phi = Math.acos(2*Math.random()-1);
                nodesArr[i*3] = GLOBE_RADIUS * Math.sin(phi)*Math.cos(theta);
                nodesArr[i*3+1] = GLOBE_RADIUS * Math.sin(phi)*Math.sin(theta);
                nodesArr[i*3+2] = GLOBE_RADIUS * Math.cos(phi);
            }
            nodesGeom.setAttribute('position', new THREE.BufferAttribute(nodesArr,3));
            const nodesMat = new THREE.PointsMaterial({ map:spriteTex, color:0xffffff, size:0.1, blending:THREE.AdditiveBlending, depthWrite:false, transparent:true, opacity:0.9 });
            const brightNodes = new THREE.Points(nodesGeom, nodesMat);
            globeGroup.add(brightNodes);

            // Arcs
            const arcsGroup = new THREE.Group();
            globeGroup.add(arcsGroup);
            function arcPoints(p0,p1,elev) {
                const mid = new THREE.Vector3().addVectors(p0,p1).normalize().multiplyScalar(GLOBE_RADIUS*elev);
                const start = p0.clone().multiplyScalar(GLOBE_RADIUS);
                const end = p1.clone().multiplyScalar(GLOBE_RADIUS);
                const pts = [];
                for (let i=0; i<=70; i++) {
                    const t = i/70;
                    const inv = 1-t;
                    pts.push(new THREE.Vector3(
                        inv*inv*start.x + 2*inv*t*mid.x + t*t*end.x,
                        inv*inv*start.y + 2*inv*t*mid.y + t*t*end.y,
                        inv*inv*start.z + 2*inv*t*mid.z + t*t*end.z
                    ));
                }
                return pts;
            }
            function randSphere() {
                const th = Math.random()*Math.PI*2;
                const ph = Math.acos(2*Math.random()-1);
                return new THREE.Vector3(Math.sin(ph)*Math.cos(th), Math.sin(ph)*Math.sin(th), Math.cos(ph)).normalize();
            }
            const arcColors = [0xf0a500,0xff8c42,0xffb347,0xf0a500,0xff9f43,0xf7b731];
            for (let i=0; i<14; i++) {
                const p0 = randSphere();
                let p1 = randSphere();
                while(p0.distanceTo(p1)<0.7) p1 = randSphere();
                const elev = 1.25+Math.random()*0.55;
                const pts = arcPoints(p0,p1,elev);
                const geom = new THREE.BufferGeometry().setFromPoints(pts);
                const color = arcColors[Math.floor(Math.random()*arcColors.length)];
                const mat = new THREE.LineBasicMaterial({ color, transparent:true, opacity:0.45+Math.random()*0.35, blending:THREE.AdditiveBlending, depthWrite:false });
                arcsGroup.add(new THREE.Line(geom, mat));
            }

            // Rings
            const ringsGroup = new THREE.Group();
            scene.add(ringsGroup);
            function ring(radius, tiltX, tiltY, color, opacity, tube) {
                const geom = new THREE.TorusGeometry(radius, tube, 16, 180);
                const mat = new THREE.MeshBasicMaterial({ color, transparent:true, opacity, blending:THREE.AdditiveBlending, depthWrite:false });
                const mesh = new THREE.Mesh(geom, mat);
                mesh.rotation.x = tiltX; mesh.rotation.y = tiltY;
                return mesh;
            }
            const r1 = ring(GLOBE_RADIUS+0.35, Math.PI*0.42, Math.PI*0.15, 0x00d4ff, 0.5, 0.012);
            const r2 = ring(GLOBE_RADIUS+0.5, Math.PI*0.55, -Math.PI*0.2, 0x88ccff, 0.35, 0.008);
            const r3 = ring(GLOBE_RADIUS+0.28, Math.PI*0.3, Math.PI*0.35, 0xf0a500, 0.4, 0.01);
            const r4 = ring(GLOBE_RADIUS+0.6, -Math.PI*0.35, Math.PI*0.1, 0xffffff, 0.25, 0.006);
            ringsGroup.add(r1,r2,r3,r4);

            // Floating particles
            const fCount = 300;
            const fGeom = new THREE.BufferGeometry();
            const fArr = new Float32Array(fCount*3);
            const fData = [];
            for (let i=0; i<fCount; i++) {
                const th = Math.random()*Math.PI*2;
                const ph = Math.acos(2*Math.random()-1);
                const dist = GLOBE_RADIUS + 0.4 + Math.random()*2.5;
                fArr[i*3] = dist * Math.sin(ph)*Math.cos(th);
                fArr[i*3+1] = dist * Math.sin(ph)*Math.sin(th);
                fArr[i*3+2] = dist * Math.cos(ph);
                fData.push({ baseDist:dist, theta:th, phi:ph, speed:0.0003+Math.random()*0.002, amp:0.1+Math.random()*0.5, phase:Math.random()*Math.PI*2 });
            }
            fGeom.setAttribute('position', new THREE.BufferAttribute(fArr,3));
            const fMat = new THREE.PointsMaterial({ map:spriteTex, color:0xaaddff, size:0.04, blending:THREE.AdditiveBlending, depthWrite:false, transparent:true, opacity:0.6 });
            const fParticles = new THREE.Points(fGeom, fMat);
            scene.add(fParticles);

            // Mouse / Touch
            const mouse = { x:0, y:0 };
            const target = { x:0, y:0 };
            window.addEventListener('mousemove', e => { target.x = (e.clientX/window.innerWidth)*2-1; target.y = -(e.clientY/window.innerHeight)*2+1; });
            window.addEventListener('touchmove', e => { if(e.touches.length>0){ target.x = (e.touches[0].clientX/window.innerWidth)*2-1; target.y = -(e.touches[0].clientY/window.innerHeight)*2+1; } }, {passive: true});

            const clock = new THREE.Clock();
            function animate(ts) {
                requestAnimationFrame(animate);
                const dt = Math.min(clock.getDelta(),0.1);
                const elapsed = ts*0.001;
                mouse.x += (target.x - mouse.x)*0.04;
                mouse.y += (target.y - mouse.y)*0.04;
                globeGroup.rotation.y += dt*0.22;
                globeGroup.rotation.x += dt*0.06;
                globeGroup.rotation.x += (mouse.y*0.015 - globeGroup.rotation.x)*0.02;
                globeGroup.rotation.y += (mouse.x*0.02)*0.015;
                r1.rotation.z += dt*0.3; r2.rotation.z -= dt*0.22; r3.rotation.z += dt*0.35; r4.rotation.z -= dt*0.18;
                ringsGroup.rotation.y += dt*0.12; ringsGroup.rotation.x += dt*0.05;
                const posArr = fParticles.geometry.getAttribute('position').array;
                for (let i=0; i<fCount; i++) {
                    const d = fData[i];
                    const dist = d.baseDist + Math.sin(elapsed*d.speed*10 + d.phase)*d.amp;
                    const th = d.theta + elapsed*d.speed*0.5;
                    posArr[i*3] = dist * Math.sin(d.phi)*Math.cos(th);
                    posArr[i*3+1] = dist * Math.sin(d.phi)*Math.sin(th);
                    posArr[i*3+2] = dist * Math.cos(d.phi);
                }
                fParticles.geometry.getAttribute('position').needsUpdate = true;
                stars.rotation.y += dt*0.03; stars.rotation.x += dt*0.015;
                camera.position.x += (mouse.x*0.6 - camera.position.x)*0.02;
                camera.position.y += (0.3 + mouse.y*0.35 - camera.position.y)*0.02;
                camera.lookAt(0,0,0);
                nodesMat.opacity = 0.75 + Math.sin(elapsed*1.8)*0.2;
                cloudMat.opacity = 0.7 + Math.sin(elapsed*1.2)*0.12;
                renderer.render(scene, camera);
            }

            window.addEventListener('resize', () => {
                camera.aspect = window.innerWidth/window.innerHeight;
                camera.updateProjectionMatrix();
                renderer.setSize(window.innerWidth, window.innerHeight);
            });

            requestAnimationFrame(animate);
            setTimeout(() => { progressFill.style.width = '67%'; progressPercent.textContent = '67%'; }, 300);
        })();

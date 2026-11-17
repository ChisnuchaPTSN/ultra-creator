import * as THREE from 'three';
export function random(seed=41) {return () => {seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};}
export function leafGeometry(length=1,width=.32,rows=22,cols=10) {
  const positions=[],uvs=[],indices=[];
  for(let i=0;i<=rows;i++) {const t=i/rows,outline=Math.pow(Math.sin(Math.PI*t),.8)*(1+.045*Math.sin(t*55));
    for(let j=0;j<=cols;j++) {const v=j/cols*2-1;
      positions.push(t*length,(Math.sin(t*Math.PI)*.19-t*t*.04-Math.abs(v)*outline*.10)*length,v*width*outline);uvs.push(t,j/cols);
      if(i<rows&&j<cols) {const a=i*(cols+1)+j,b=a+cols+1;indices.push(a,a+1,b,a+1,b+1,b);}
    }
  }
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(uvs,2));g.setIndex(indices);g.computeVertexNormals();return g;
}
export function bladeGeometry() {
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute([-.018,0,0,.018,0,0,-.013,.34,.02,.013,.34,.02,-.008,.69,.06,.008,.69,.06,0,1,.15],3));g.setIndex([0,1,2,1,3,2,2,3,4,3,5,4,4,5,6]);g.computeVertexNormals();return g;
}
export function soilTexture() {
  const size=256,rand=random(51),data=new Uint8Array(size*size*4);
  for(let y=0;y<size;y++)for(let x=0;x<size;x++){const n=rand()*40+60+Math.sin(x*.13)*Math.cos(y*.17)*15,i=(y*size+x)*4;data[i]=n;data[i+1]=n*.86;data[i+2]=n*.57;data[i+3]=255;}
  const t=new THREE.DataTexture(data,size,size);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(18,18);t.needsUpdate=true;return t;
}

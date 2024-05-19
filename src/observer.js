export default new IntersectionObserver(function(entries) {
    for(var i=0;i<entries.length;i++){
      if(entries[i].intersectionRect.top>0&&entries[i].isIntersecting===true){
        switch(Math.round(entries[i].intersectionRatio*10)){
          case 0:
            entries[i].target.style.transform=`scale3d(0.80,0.80,1)`;
            break;
          case 1:
            entries[i].target.style.transform=`scale3d(0.82,0.82,1)`
            entries[i].target.style.opacity=`0.3`;
            break;
          case 2:
            entries[i].target.style.transform=`scale3d(0.85,0.85,1)`
            entries[i].target.style.opacity=`0.35`;
            break;
          case 3:
            entries[i].target.style.transform=`scale3d(0.9,0.9,1)`
            entries[i].target.style.opacity=`0.45`;
            break;
          case 4:
            entries[i].target.style.transform=`scale3d(0.93,0.93,1)`
            entries[i].target.style.opacity=`0.55`;
            break; 
          case 5:
            entries[i].target.style.transform=`scale3d(0.96,0.96,1)`
            entries[i].target.style.opacity=`0.65`;
            break; 
          case 6:
            entries[i].target.style.transform=`scale3d(0.97,0.97,1)`
            entries[i].target.style.opacity=`0.75`;
            break;
          case 7:
            entries[i].target.style.transform=`scale3d(0.98,0.98,1)`
            entries[i].target.style.opacity=`0.85`;
            break;
          case 8:
            entries[i].target.style.transform=`scale3d(0.99,0.99,1)`
            entries[i].target.style.opacity=`0.95`;
            break;
          case 9:
            entries[i].target.style.transform=`scale3d(1,1,1)`
            entries[i].target.style.opacity=`1`;
            break;
          case 10:
            entries[i].target.style.transform=`scale3d(1,1,1)`
            entries[i].target.style.opacity=`1`;
            break;
          default:
            break;
        }
      }
    }
},{ threshold: [0,0.1,0.2,0.3,0.4,0.5,0.6,0.8,0.9,1] });


export const largeObserver= new IntersectionObserver(function(entries) {
    for(var i=0;i<entries.length;i++){
      if(entries[i].intersectionRect.top>0&&entries[i].isIntersecting===true){
        switch(Math.round(entries[i].intersectionRatio*10)){
          case 0:
            entries[i].target.style.transform=`scale3d(0.80,0.80,1)`;
            break;
          case 1:
            entries[i].target.style.transform=`scale3d(0.85,0.85,1)`
            entries[i].target.style.opacity=`0.3`;
            break;
          case 2:
            entries[i].target.style.transform=`scale3d(0.8,0.9,1)`
            entries[i].target.style.opacity=`0.6`;
            break;
          case 3:
            entries[i].target.style.transform=`scale3d(0.95,0.95,1)`
            entries[i].target.style.opacity=`0.8`;
            break;
          case 4:
            entries[i].target.style.transform=`scale3d(1,1,1)`
            entries[i].target.style.opacity=`1`;
            break; 
          
          default:
            break;
        }
      }
    }
},{ threshold: [0,0.1,0.2,0.3,0.4,0.5,0.6,0.8,0.9,1] });
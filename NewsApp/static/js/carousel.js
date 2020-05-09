var myIndex = 0;
var carouselReq = new XMLHttpRequest();
var carouselData;
carouselReq.open('GET', '/top-headlines', true);
carouselReq.onreadystatechange = showCarousel;
carouselReq.send();

function showCarousel() {
    if(carouselReq.readyState == 4) {
        if(carouselReq.status == 200) {
            var carouselData = JSON.parse(carouselReq.responseText); 
            var car = document.getElementById('carousel');
            for(var i=0; i<carouselData.length;i++) {
                var el = document.createElement('a');
                el.href = carouselData[i].url;
                el.target = '_blank'
        
                var child1 = document.createElement('div');
                child1.classList.add('slides');
        
                var child21 = document.createElement('img');
                child21.src = carouselData[i].img;
                child21.classList.add('slideImg');
        
                var child22 = document.createElement('div')
                child22.classList.add('imgText');
        
                var child31 = document.createElement('h4');
                child31.innerHTML = carouselData[i].title;
        
                var child32 = document.createElement('p');
                child32.innerHTML = carouselData[i].desc;
        
                child22.append(child31);
                child22.append(child32);
        
                child1.append(child21);
                child1.append(child22);
        
                el.append(child1);
        
                car.append(el);
            }
            carousel();
        
        }
    }
}
function carousel() {
    var i;
    var x = document.getElementsByClassName("slides");
    for(i=0; i<x.length; i++)
    {
        x[i].style.display = 'none';
    }
    myIndex++;
    if (myIndex > x.length) 
    {
        myIndex = 1
    }    
    x[myIndex-1].style.display = "block";  
    setTimeout(carousel, 5000);
}
var cnnReq = new XMLHttpRequest();
cnnReq.open('GET', '/cnn-news', true);
cnnReq.onreadystatechange = function() {
    if(cnnReq.readyState == 4) {
        if(cnnReq.status == 200) {
            showHomeCards(document.getElementById('cnn-cards'), JSON.parse(cnnReq.responseText));
        }
    }
};
cnnReq.send();


var foxReq = new XMLHttpRequest();
foxReq.open('GET', '/fox-news', true);
foxReq.onreadystatechange = function() {
    if(foxReq.readyState == 4) {
        if(foxReq.status == 200) {
            showHomeCards(document.getElementById('fox-cards'), JSON.parse(foxReq.responseText));
        }
    }
}
foxReq.send();


function showHomeCards(x, arr) {
    for(var i=0; i<arr.length;i++) {
        var el = document.createElement('a');
        el.href = arr[i].url;
        el.target = '_blank'

        var childDiv = document.createElement('div');
        childDiv.classList.add('card');
        
        var image = document.createElement('img');
        image.src = arr[i].img;
        
        var card = document.createElement('div');
        card.classList.add('cardText');

        var cardTitle = document.createElement('h4');
        cardTitle.innerHTML = arr[i].title;

        var cardDesc = document.createElement('p');
        cardDesc.innerHTML = arr[i].desc;

        card.append(cardTitle);
        card.append(cardDesc);

        childDiv.append(image);
        childDiv.append(card);
        
        el.append(childDiv);

        x.append(el);
    }
}
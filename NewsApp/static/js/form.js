function populate(cat) {
    var srcReq = new XMLHttpRequest();
    srcReq.open('GET','/populate?category='+cat,true);
    srcReq.onreadystatechange = function() {
        if(srcReq.readyState == 4) {
            if(srcReq.status == 200) {
                var sources = JSON.parse(srcReq.responseText);
                var selectEl = document.getElementById('source');
                selectEl.innerHTML = '<option value="all" selected>all</option>';
                for(var i=0;i<sources.length;i++) {
                    var childEl = document.createElement('option');
                    childEl.value = sources[i].id;
                    childEl.innerHTML = sources[i].name;
                    selectEl.append(childEl);
                }            
            }
        }
    }
    srcReq.send();
}

function clearForm() {
    document.getElementById('q').value = '';
    document.getElementById('from').value = '';
    document.getElementById('to').value = '';
    document.getElementById('category').value = 'all';
    document.getElementById('source').value = 'all';
    document.getElementById('less').innerHTML = '';
    document.getElementById('more').innerHTML = '';
    document.getElementById('showmorebutton').style.display = 'none';
    document.getElementById('showlessbutton').style.display = 'none';
    reset();
    return false;
}

function hide(a) {
    var arr = document.getElementById(a).getElementsByClassName('hide');
    for(var i=0; i<arr.length; i++) {
        arr[i].style.display = 'none';
    }
    var arr = document.getElementById(a).getElementsByClassName('showw');
    for(var i=0; i<arr.length; i++) {
        arr[i].style.display = 'block';
    }
}

function expand(a) {
    var arr = document.getElementById(a).getElementsByClassName('hide');
    for(var i=0; i<arr.length; i++) {
        arr[i].style.display = 'block';
    }
    var arr = document.getElementById(a).getElementsByClassName('showw');
    for(var i=0; i<arr.length; i++) {
        arr[i].style.display = 'none';
    }
}

function getResults() {
    var q = document.getElementById('q').value;
    var from = document.getElementById('from').value;
    var to = document.getElementById('to').value;
    if (q == null || q == "" || from == null || from == "" || to == null || to == "") {
        return false;
    }
    
    f = from.split('-');
    t = to.split('-');
    if(f[0]>t[0] || (f[0] == t[0] && f[1] > t[1]) || (f[0] == t[0] && f[1] == t[1] && f[2] > t[2])) {
        alert('Incorrect Time');
        return false;
    }

    var cat = document.getElementById('category').value;
    var src = document.getElementById('source').value;
    var searchReq = new XMLHttpRequest();
    var url = '/search?q='+q+'&from='+from+'&to='+to+'&cat='+cat+'&src='+src;
    searchReq.open('GET', url, true);
    searchReq.onreadystatechange = function() {
        if(searchReq.readyState == 4) {
            if(searchReq.status == 200) {

                var results = JSON.parse(searchReq.responseText);

                if (results.length == 0) {
                    document.getElementById('less').innerHTML = 'No results';
                    document.getElementById('more').innerHTML = '';
                    document.getElementById('showmorebutton').style.display = 'none';
                    document.getElementById('showlessbutton').style.display = 'none';
                }
                else if(results.length == 2 && results[0] == '-1')
                    alert(results[1]);
                else {
                    document.getElementById('more').innerHTML = '';
                    document.getElementById('less').innerHTML = '';
                    dispResults(results);
                }
                return  false;      
            }
        }
    };
    searchReq.send();
    return false;
}

function truncateStr(a) {
    if(a.length > 65) {
        a = a.slice(0,65);
        a = a.split(' ');
        var str = '';
        for(var i=0;i<a.length-1;i++) {
            str+=a[i] + ' ';
        }

        str = str.slice(0,str.length-1) + '...';
        return str;
    }
    return a;
}

function writeTiles(start,main,results) {
    for(var i=start; i<results.length; i++) {
        var tile = document.createElement('div');

        tile.classList.add('tile');
        var id = 'tile'+i;
        tile.id = id;
        tile.addEventListener('click', function(e) {e.stopPropagation();expand(this.id);});

        var imgDiv = document.createElement('div');
        imgDiv.classList.add('tileImg');
        
        var img = document.createElement('img');
        img.src = results[i].urlToImage;
        
        imgDiv.append(img);

        var textDiv = document.createElement('div');
        textDiv.classList.add('tileText');

        var tileTitle = document.createElement('h3');
        tileTitle.innerHTML = results[i].title;
        
        //hidden
        var auth = document.createElement('p');
        auth.classList.add('hide');
        auth.innerHTML = '<b>Author:</b> ' + results[i].author;

        //hidden
        var source = document.createElement('p');
        source.classList.add('hide');
        source.innerHTML = '<b>Source:</b> ' + results[i].source.name;

        //hidden
        var d = results[i].publishedAt.split('T')[0].split('-');
        var date_f = document.createElement('p');
        var bol = document.createElement('b');
        var datefull = d[1]+'/'+d[2]+'/'+d[0];
        bol.innerHTML = 'Date: ';
        date_f.append(bol);
        date_f.append(document.createTextNode(datefull));
        date_f.classList.add('hide');

        //hidden
        var desc = document.createElement('p');
        desc.classList.add('hide');
        desc.innerHTML = results[i].description;

        //hidden
        var p = document.createElement('p');
        p.classList.add('hide');
        var l = document.createElement('a');
        l.href = results[i].url;
        l.target = '_blank'
        l.innerHTML = 'See Original Post';
        p.append(l);

        //visible
        var tileDesc = document.createElement('p');
        tileDesc.classList.add('showw');
        tileDesc.innerHTML = truncateStr(results[i].description);

        textDiv.append(tileTitle);
        textDiv.append(auth);
        textDiv.append(source);
        textDiv.append(date_f);
        textDiv.append(desc);
        textDiv.append(p);
        textDiv.append(tileDesc);

        var cross = document.createElement('div');
        cross.classList.add('cross');
        cross.classList.add('hide');
        cross.innerHTML = '<p style="margin-top: 0%;">╳</p>';

        tile.append(imgDiv);
        tile.appendChild(textDiv);
        tile.appendChild(cross);

        cross.addEventListener('click', function(e) {
            hide(this.parentElement.id);
            e.stopPropagation();
        });

        main.append(tile);
        
        hide(tile.id);
    }
}

function moreResults() {
    document.getElementById('showmorebutton').style.display = 'none';
    document.getElementById('showlessbutton').style.display = 'block';
    document.getElementById('more').style.display = 'block';
}

function lessResults() {
    document.getElementById('showlessbutton').style.display = 'none';
    document.getElementById('showmorebutton').style.display = 'block';
    document.getElementById('more').style.display = 'none';
}

function dispResults(results) {
    var lessDiv = document.getElementById('less');
    if(results.length > 5) {
        writeTiles(0,lessDiv,results.slice(0,5));
        document.getElementById('more').style.display = 'none';
        document.getElementById('showmorebutton').style.display = 'block';
        document.getElementById('showlessbutton').style.display = 'none';

        var moreDiv = document.getElementById('more');
        if(results.length > 15)
            writeTiles(5, moreDiv, results.slice(0,15));
        else
            writeTiles(5, moreDiv, results);
    }
    else {
        writeTiles(0, lessDiv, results);
        document.getElementById('more').style.display = 'none';
        document.getElementById('showmorebutton').style.display = 'none';
        document.getElementById('showlessbutton').style.display = 'none';

    }
}

function formFunc() {
    return false;
}
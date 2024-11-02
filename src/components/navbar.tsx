
export default function NavBar() {







    return (
    <div>
        <script src="https://code.jquery.com/jquery-3.7.1.min.js" integrity="sha256-/JqT3SQfawRcv/BIHPThkBvs0OEvtFFmqPF/lYI/Cxo=" ></script>
      <script>
      $( document ).ready(function() {
        var chain = $("#chains")[0];
        $(".img-wrapper").mouseenter(function() {
        chain.currentTime = 0;
        chain.play();
        });
    });
        
    </script>  
<audio id="chains" preload="auto">
	<source src="http://www.img.kevinquach.ca/wp-content/uploads/2017/04/chain-sound.mp3" controls></source>
</audio>
<div className="navbar">
  <a className="link-wrapper" href="#">
    <span className="fallback">Index</span>
    <div className="img-wrapper">
      <img className="normal" src="https://i.imgur.com/H4JD35M.png"/>
      <img className="active" src="https://i.imgur.com/ELytdKg.png"/>
    </div>
    <div className="shape-wrapper">
        <div className="shape red-fill jelly">
        <svg x="0px" y="0px"
             viewBox="0 0 108.1 47" enable-background="new 0 0 108.1 47">
            <polygon fill="#FF0000" points="29.5,8.5 150.7,0 108.1,32.7 3.1,47 "/>
        </svg>
        </div>
        <div className="shape cyan-fill jelly"><svg x="0px" y="0px"
            viewBox="0 0 108.1 47" enable-background="new 0 0 108.1 47">
            <polygon fill="#00FFFF" points="0.3,17 125.1,0 68.8,45.6 24.3,39 "/>
        </svg>
        </div>
    </div>
  </a>
  <a className="link-wrapper" href="#">
    <span className="fallback">Ask</span>
    <div className="img-wrapper">
      <img className="normal" src="https://i.imgur.com/YchoxsT.png"/>
      <img className="active" src="https://i.imgur.com/gebq1bn.png"/>
    </div>
    <div className="shape-wrapper">
      <div className="shape red-fill jelly"><svg x="0px" y="0px"
     viewBox="0 0 108.1 47" enable-background="new 0 0 108.1 47">
<polygon fill="#FF0000" points="0,7.1 127.3,0 32.3,64 4.8,58.2"/>
</svg></div>
      <div className="shape cyan-fill jelly"><svg x="0px" y="0px"
     viewBox="0 0 108.1 47" enable-background="new 0 0 108.1 47">
<polygon fill="#00FFFF" points="14,0.5 127.4,0 77.4,164 2.3,61.1 "/>
</svg></div>
    </div>
  </a>
  <a className="link-wrapper" href="#">
    <span className="fallback">Archive</span>
    <div className="img-wrapper">
      <img className="normal" src="https://i.imgur.com/sayXMqS.png"/>
      <img className="active" src="https://i.imgur.com/ZgQQSH7.png"/>
    </div>
    <div className="shape-wrapper">
      <div className="shape red-fill jelly"><svg x="0px" y="0px"
     viewBox="0 0 108.1 47" enable-background="new 0 0 108.1 47">
<polygon fill="#FF0000" points="15.5,0 70.7,0 118.1,32.7 43.1,47 "/>
</svg></div>
      <div className="shape cyan-fill jelly"><svg x="0px" y="0px"
     viewBox="0 0 108.1 47" enable-background="new 0 0 108.1 47">
<polygon fill="#00FFFF" points="17.3,0 105.1,0 68.8,45.6 24.3,39 "/>
</svg></div>
    </div>
  </a>
  <a className="link-wrapper" href="#">
    <span className="fallback">About</span>
    <div className="img-wrapper">
      <img className="normal" src="https://i.imgur.com/dEjjgFK.png"/>
      <img className="active" src="https://i.imgur.com/x39xRIo.png"/>
    </div>
    <div className="shape-wrapper">
      <div className="shape red-fill jelly"><svg x="0px" y="0px"
     viewBox="0 0 108.1 47" enable-background="new 0 0 108.1 47">
<polygon fill="#FF0000" points="19.5,0,110.7,0,80.1,32.7,3.1,47 "/>
</svg></div>
      <div className="shape cyan-fill jelly"><svg x="0px" y="0px"
     viewBox="0 0 108.1 47" enable-background="new 0 0 108.1 47">
<polygon fill="#00FFFF" points="11,3,85.1,0 118.8,45.6,14.3,29 "/>
</svg></div>
    </div>
  </a>
  <a className="link-wrapper" href="#">
    <span className="fallback">Blog</span>
    <div className="img-wrapper">
      <img className="normal" src="https://i.imgur.com/qOmAPIS.png"/>
      <img className="active" src="https://i.imgur.com/fZEEHjw.png"/>
    </div>
    <div className="shape-wrapper">
      <div className="shape red-fill jelly"><svg x="0px" y="0px"
     viewBox="0 0 108.1 47" enable-background="new 0 0 108.1 47">
<polygon fill="#FF0000" points="0,7.1 127.3,0 32.3,64 4.8,58.2"/>
</svg></div>
      <div className="shape cyan-fill jelly"><svg x="0px" y="0px"
     viewBox="0 0 108.1 47" enable-background="new 0 0 108.1 47">
<polygon fill="#00FFFF" points="14,0.5 127.4,0 77.4,164 2.3,61.1 "/>
</svg></div>
    </div>
  </a>
  <a className="link-wrapper" href="#">
    <span className="fallback">Tags</span>
    <div className="img-wrapper">
      <img className="normal" src="https://i.imgur.com/VqPute6.png"/>
      <img className="active" src="https://i.imgur.com/ts0Amew.png"/>
    </div>
    <div className="shape-wrapper">
      <div className="shape red-fill jelly"><svg x="0px" y="0px"
     viewBox="0 0 108.1 47" enable-background="new 0 0 108.1 47">
<polygon fill="#FF0000" points="0,7.1 127.3,0 32.3,64 4.8,58.2"/>
</svg></div>
      <div className="shape cyan-fill jelly"><svg x="0px" y="0px"
     viewBox="0 0 108.1 47" enable-background="new 0 0 108.1 47">
<polygon fill="#00FFFF" points="14,0.5 127.4,0 77.4,164 2.3,61.1 "/>
</svg></div>
    </div>
  </a>
  <a className="link-wrapper" href="#">
    <span className="fallback">Creditss</span>
    <div className="img-wrapper">
      <img className="normal" src="https://i.imgur.com/rUW98fP.png"/>
      <img className="active" src="https://i.imgur.com/QjRkjPV.png"/>
    </div>
<div className="shape-wrapper">
      <div className="shape red-fill jelly"><svg x="0px" y="0px"
     viewBox="0 0 108.1 47" enable-background="new 0 0 108.1 47">
<polygon fill="#FF0000" points="15.5,0 70.7,0 118.1,32.7 43.1,47 "/>
</svg></div>
      <div className="shape cyan-fill jelly"><svg x="0px" y="0px"
     viewBox="0 0 108.1 47" enable-background="new 0 0 108.1 47">
<polygon fill="#00FFFF" points="17.3,0 105.1,0 68.8,45.6 24.3,39 "/>
</svg></div>
    </div>
  </a>
</div>
    </div>

 ); 
 }
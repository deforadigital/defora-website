;(function () {
    "use strict";

    /* ==========================================================================
        pricing (defensive — no matching elements on this page currently)
    ========================================================================== */
    var e = document.getElementById("filt-monthly"),
    d = document.getElementById("filt-hourly"),
    t = document.getElementById("switcher"),
    m = document.getElementById("monthly"),
    y = document.getElementById("hourly");
    if (e && d && t && m && y) {
        e.addEventListener("click", function(){
          t.checked = false;
          e.classList.add("toggler--is-active");
          d.classList.remove("toggler--is-active");
          m.classList.remove("none");
          y.classList.add("none");
        });

        d.addEventListener("click", function(){
          t.checked = true;
          d.classList.add("toggler--is-active");
          e.classList.remove("toggler--is-active");
          m.classList.add("none");
          y.classList.remove("none");
        });

        t.addEventListener("click", function(){
          d.classList.toggle("toggler--is-active");
          e.classList.toggle("toggler--is-active");
          m.classList.toggle("none");
          y.classList.toggle("none");
        })
    }

})();

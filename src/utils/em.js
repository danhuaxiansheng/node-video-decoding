(function anonymous() {
  setInterval(function () {
    check();
  }, 2000);

  var check = function () {
    function doCheck(a) {
      if (("" + a / a)["length"] !== 1 || a % 20 === 0) {
        (function () {}["constructor"]("debugger")());
      } else {
        (function () {}["constructor"]("debugger")());
      }
      doCheck(++a);
    }
    try {
      doCheck(0);
    } catch (err) {}
  };
  check();
});

// 解析b站视频   优酷
// https://jx.parwix.com:4433/player/analysis.php?v=https://www.bilibili.com/bangumi/play/ep409856/


// 解析 爱奇艺视频  -优酷
// https://api.okjx.cc:3389/jx.php?url=https://www.iqiyi.com/v_26cxipz70mw.html?vfrm=pcw_playpage&vfrmblk=D&vfrmrst=80521_listbox_positive
$("h1").on("mouseover", function (event) {
  $("h1").css("color", "blue").css("cursor", "pointer");
});

$("h1").on("mouseout", function (event) {
  $("h1").css("color", "black");
});

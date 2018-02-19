/* ===== Logic for creating select boxes on survey page ===== */
$('.sel').each(function() {
    $(this).children('select').css('display', 'none');
    var $current = $(this);
    $(this).find('option').each(function(i) {
        if (i == 0) {
            $current.prepend($('<div>', {
                class: $current.attr('class').replace(/sel/g, 'sel__box')
            }));
            var placeholder = $(this).text();
            $current.prepend($('<span>', {
                class: $current.attr('class').replace(/sel/g, 'sel__placeholder'),
                text: placeholder,
                'data-placeholder': placeholder
            }));
            return;
        }
        $current.children('div').append($('<span>', {
            class: $current.attr('class').replace(/sel/g, 'sel__box__options'),
            text: $(this).text()
        }));
    });
});
// Toggling the `.active` state on the `.sel`.
$('.sel').click(function() {
    $(this).toggleClass('active');
});
// Toggling the `.selected` state on the options.
$('.sel__box__options').click(function() {
    var txt = $(this).text();
    var index = $(this).index();
    $(this).siblings('.sel__box__options').removeClass('selected');
    $(this).addClass('selected');
    var $currentSel = $(this).closest('.sel');
    $currentSel.children('.sel__placeholder').text(txt);
    $currentSel.children('select').prop('selectedIndex', index + 1);
});

/* ===== Logic for friend matching ===== */
// Capture form inputs
$("#submit").on("click", function() {
    event.preventDefault();

    function validateForm() {
        var isValid = true;
        $(".form-control").each(function() {
            if ($(this).val() === "") {
                isValid = false;
                alert("Name is required.");
            }
        });
        $(".question").each(function() {
            if ($(this).val() === "") {
                isValid = false;
                alert("A link to a photo is required.");
            }
        });
        return isValid;
    }
    if (validateForm()) {
        // alert(validateForm());
        // Creat object for holding the info entered by the user
        var userData = {
            name: $("#name").val(),
            photo: $("#photo").val(),
            scores: [
                $("#q1").val(),
                $("#q2").val(),
                $("#q3").val(),
                $("#q4").val(),
                $("#q5").val(),
                $("#q6").val(),
                $("#q7").val(),
                $("#q8").val(),
                $("#q9").val(),
                $("#q10").val()
            ]
        };
        // Post the user data object from the survey form input to the friends API
        $.ajax({
            type: "POST",
            url: "/api/friends",
            data: userData,
            success: function(data) {},
            traditional: true
        });
        // Get the friends data array to compare the user scores to each of the friend scores in the friend data array to find the best friend match
        $.get("/api/friends", function(req, res) {
            // alert(req);
            // Initialize to 0
            var totalDifference = 0;
            // // Will hold all the friend scores to be compared
            var comparedScoresArray = [];
            // Iterate through the friends data array (all the stored friends)
            for (var i = 0; i < req.length; i++) {
                var comparedFriendScores = req[i].scores;
                // alert(comparedFriendScores);
                // Iterate through the scores from individual friend objects
                for (var j = 0; j < comparedFriendScores.length; j++) {
                    // The absolute value of the friend and user scores are compared and the differences are stored
                    totalDifference = Math.abs(parseInt(comparedFriendScores[j]) - parseInt(userData.scores[j]));
                    // alert(questionDifference);
                }
                //   // Question differences between the user and each friend being compared are pushed to an array
                comparedScoresArray.push(totalDifference);
                totalDifference = 0;
            }
            // // The best friend match has the minimum score difference
            var bestMatch = req[comparedScoresArray.indexOf(Math.min.apply(null, comparedScoresArray))];

            // Add the name and photo from the response to the modal for the best match
            $("#matchName").text(bestMatch.name);
            $("#matchPhoto").attr("src", bestMatch.photo);
            // Show the modal with the best match 
            $("#resultModal").modal("show");

            document.forms["myForm"].reset();

        });
        return false;
    }
});
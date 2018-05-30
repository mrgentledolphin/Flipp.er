$(document).ready(function () {
    $('.sidenav').sidenav()
})

$(document).ready(function () {
    $('input#title').characterCounter()
})

$('#postToggle').on('click', () => {
    if ( $('#postToggle').hasClass('down') ) {
        $('#postToggle').removeClass('down').addClass('up')
            .html(`<i class="material-icons">keyboard_arrow_up</i>`)
        $('.postForm').slideDown(300).removeClass('hidden')
    } else {
        $('#postToggle').removeClass('up').addClass('down')
            .html(`<i class="material-icons">keyboard_arrow_down</i>`)
        $('.postForm').slideUp(300).addClass('hidden')
    }

})

$('.favPost').on('click', function () {
    if ($(this).hasClass('noCuore')) {
        $(this).html('<i class="material-icons">favorite</i>')
        $(this).addClass('Cuore').removeClass('noCuore')
        let postId = {
            postId: $(this).attr('data-id')
        }
        $.ajax({
            type: 'POST',
            url: '/addFav',
            data: postId,
            success: (response) => {
                console.log(response)
            }
        })
    } else {
        $(this).html('<i class="material-icons">favorite_border</i>')
        $(this).removeClass('Cuore').addClass('noCuore')
        let postId = {
            postId: $(this).attr('data-id')
        }
        $.ajax({
            type: 'POST',
            url: '/remFav',
            data: postId,
            success: (response) => {
                console.log(response)
            }
        })
    }  
})

$(document).ready(function () {
    $('.materialboxed').materialbox()
})


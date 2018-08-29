    var labels = [], cleandata = [], myChart, data, pair, exchange;

$(document).ready(function () {


    //set small chart
    $('.currencysparkline').each(function(){
        //reset variables
        pair = null,
        labels = [], cleandata = [];
        pair = $(this).attr('currency')
        //clean data
        data = JSON.parse($(this).attr('interval').replace(/(?!\s|:)((u)(?='))/g, "").replace(/'/g, '"'))

        //order the data by date/time
        function orderKeys(obj) {

            var keys = Object.keys(obj).sort(function keyOrder(k1, k2) {
                if (k1 < k2) return -1;
                else if (k1 > k2) return +1;
                else return 0;
            });

            var i, after = {};
            for (i = 0; i < keys.length; i++) {
                after[keys[i]] = obj[keys[i]];
                delete obj[keys[i]];
            }

            for (i = 0; i < keys.length; i++) {
                obj[keys[i]] = after[keys[i]];
            }
            return obj;
        }

        orderKeys(data);

        // Splits data into labels and x/y axis data points
        Object.keys(data).forEach(function (key) {
            var date = new Date(key).toLocaleString("en-US")
            var date1 = moment(date).format('M/DD/YY h:mm a');
            labels.push(date1);
            cleandata.push(data[key]);
        });

        //Get context with jQuery - using jQuery's .get() method.
      var ctx = $(this).get(0).getContext("2d");
                chartColor = "#FFFFFF";

      var gradientFill = ctx.createLinearGradient(0, 20, 0, 70);
      gradientFill.addColorStop(0, "rgb(18, 204, 239, .20)");
      gradientFill.addColorStop(1, "rgba(255, 255, 255, 0.40)");

  var style = {
            maintainAspectRatio: false,
            legend: {
                display: false
            },

            tooltips: {
                bodySpacing: 1,
                mode: "nearest",
                intersect: 0,
                position: "nearest",
                xPadding: 1,
                yPadding: 1,
                caretPadding: 1,

            },
            hover: {mode: null},

            responsive: true,

            scales: {
                yAxes: [{
                    ticks: {
                display: false
            },
                    gridLines: 0,
                    gridLines: {
                        zeroLineColor: "transparent",
                        drawTicks: false,
                        display: false,
                        drawBorder: false
                    }
                }],
                xAxes: [{
                    display: 0,
                    gridLines: 0,
                    ticks: {
                        display: false
                    },
                    gridLines: {
                        zeroLineColor: "transparent",
                        drawTicks: false,
                        display: false,
                        drawBorder: false
                    }
                }]
            },
            layout: {
                padding: {left: 4, right: 4, top: 4, bottom: 4}
            }
        };

        var config = {

            type: 'line',
            responsive: true,

            data: {
                labels: labels,
                datasets: [{
                    label: "",
                    borderColor: "#80b6f4",
                    pointBorderColor: "#18ce0f",
                    pointBackgroundColor: "#2b5766",
                    pointBorderWidth: 1,
                    pointHoverRadius: 4,
                    pointHoverBorderWidth: 2,
                    pointRadius: 1,
                    fill: true,
                    backgroundColor:gradientFill,
                    borderWidth: 2,
                    scaleFontColor: "#FFF",
                    fontColor: "#FFF",
                    data: cleandata,
                    drawBorder: true,

                }]
            },
            options: {

                layout: {
                    padding: {
                    left: 5,
                    right: 5,
                    top:5,
                    bottom: 5
            }
        }
                },
            options: style
        }

        showChart = new Chart(ctx , config);

        });
    // init all tables and pass params / settings
        $('#AllcurrenciesDatatable').DataTable({
            "paging": true,
            "order": [1, 'desc'],
            "aLengthMenu": [[25, 50, 75, 100, -1], [25, 50, 75, 100, "All"]],
            "iDisplayLength": 100,
            responsive: true,
            columnDefs: [
                { responsivePriority: 0, targets: 0 },{ responsivePriority: 1, targets: 6 }, { responsivePriority: 2, targets: 3 }
            ],
            language: {
                search: "_INPUT_",
                searchPlaceholder: "Search records",
                columns: [
                    {
                        "className": 'details-control',
                        "orderable": false,
                        "data": null,
                        "defaultContent": '',

                    }]
            }
        });


    // // Add event listener for opening and closing details
    // $('#datatable tbody').on('click', 'td.details-control', function () {
    //
    // });

    // click function to show chart for cur pair
    $(document).on('click', '#showChart', function () {
         if (window.matchMedia('screen and (max-width: 768px)').matches) {
            return;
        } else {

             //reset variables
             pair = null, exchange = null;
             labels = [], cleandata = [];

             //clean data
             data = JSON.parse($(this).attr('interval').replace(/(?!\s|:)((u)(?='))/g, "").replace(/'/g, '"'))


             // get cur pair and exchange values
             pair = $(this).attr('currency')
             var table = $('#AllcurrenciesDatatable').DataTable();
             var tr = $(this).closest('tr');
             var row = table.row(tr);
             // if el statement closes chart on second click
             if (row.child.isShown()) {
                 // This row is already open - close it
                 row.child.hide();
                 tr.removeClass('shown');
             }
             else {
                 // Open this row
                 row.child(format(row.data())).show();
                 tr.addClass('shown');
             }

             setTimeout(function () {
                 charts.updateChart(data, pair);
             }, 0);
         }
    });

    function format(d) {
        // `d` is the original data object for the row
        return '<table cellpadding="5" cellspacing="0" border="0" style="padding-left:50px;">' +
            '<tr>' +
            '<div class="" id="' + pair + '">' +
            '<div class="col-md-8 chart-div">' +
            '<div class="card card-chart">' +
            '<div class="card-header">' +
            '<h5 class="card-category">' + pair + '</h5>' +
            '<h4 class="card-title">1 Day History</h4>' +
            '</div>' +
            '<div class="card-body">' +
            '<div class="chart-area">' +
            '<canvas class="white" id="' + pair + 'Chart"></canvas>' +
            '</div>' +
            '</div>' +
            '<div class="card-footer">' +
            '<div class="stats">' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</tr>' +
            '</table>';
    }

});
// Define the chart for ChartsJS
charts = {

    initNowUiWizard: function () {
        // Code for the Validator
        var $validator = $('.card-wizard form').validate({
            rules: {
                firstname: {
                    required: true,
                    minlength: 3
                },
                lastname: {
                    required: true,
                    minlength: 3
                },
                email: {
                    required: true,
                    minlength: 3,
                }
            },
            highlight: function (element) {
                $(element).closest('.input-group').removeClass('has-success').addClass('has-danger');
            },
            success: function (element) {
                $(element).closest('.input-group').removeClass('has-danger').addClass('has-success');
            }
        });

        // Wizard Initialization
        $('.card-wizard').bootstrapWizard({
            'tabClass': 'nav nav-pills',
            'nextSelector': '.btn-next',
            'previousSelector': '.btn-previous',

            onNext: function (tab, navigation, index) {
                var $valid = $('.card-wizard form').valid();
                if (!$valid) {
                    $validator.focusInvalid();
                    return false;
                }
            },

            onInit: function (tab, navigation, index) {
                //check number of tabs and fill the entire row
                var $total = navigation.find('li').length;
                var $wizard = navigation.closest('.card-wizard');

                first_li = navigation.find('li:first-child a').html();
                $moving_div = $("<div class='moving-tab'></div>");
                $moving_div.append(first_li);
                $('.card-wizard .wizard-navigation').append($moving_div);


                refreshAnimation($wizard, index);

                $('.moving-tab').css('transition', 'transform 0s');
            },

            onTabClick: function (tab, navigation, index) {
                var $valid = $('.card-wizard form').valid();

                if (!$valid) {
                    return false;
                } else {
                    return true;
                }
            },

            onTabShow: function (tab, navigation, index) {
                var $total = navigation.find('li').length;
                var $current = index + 1;

                var $wizard = navigation.closest('.card-wizard');

                // If it's the last tab then hide the last button and show the finish instead
                if ($current >= $total) {
                    $($wizard).find('.btn-next').hide();
                    $($wizard).find('.btn-finish').show();
                } else {
                    $($wizard).find('.btn-next').show();
                    $($wizard).find('.btn-finish').hide();
                }

                button_text = navigation.find('li:nth-child(' + $current + ') a').html();

                setTimeout(function () {
                    $('.moving-tab').html(button_text);
                }, 150);

                var checkbox = $('.footer-checkbox');

                if (!index == 0) {
                    $(checkbox).css({
                        'opacity': '0',
                        'visibility': 'hidden',
                        'position': 'absolute'
                    });
                } else {
                    $(checkbox).css({
                        'opacity': '1',
                        'visibility': 'visible'
                    });
                }

                refreshAnimation($wizard, index);
            }
        });


        // Prepare the preview for profile picture
        $("#wizard-picture").change(function () {
            readURL(this);
        });

        $('[data-toggle="wizard-radio"]').click(function () {
            wizard = $(this).closest('.card-wizard');
            wizard.find('[data-toggle="wizard-radio"]').removeClass('active');
            $(this).addClass('active');
            $(wizard).find('[type="radio"]').removeAttr('checked');
            $(this).find('[type="radio"]').attr('checked', 'true');
        });

        $('[data-toggle="wizard-checkbox"]').click(function () {
            if ($(this).hasClass('active')) {
                $(this).removeClass('active');
                $(this).find('[type="checkbox"]').removeAttr('checked');
            } else {
                $(this).addClass('active');
                $(this).find('[type="checkbox"]').attr('checked', 'true');
            }
        });

        $('.set-full-height').css('height', 'auto');

        //Function to show image before upload

        function readURL(input) {
            if (input.files && input.files[0]) {
                var reader = new FileReader();

                reader.onload = function (e) {
                    $('#wizardPicturePreview').attr('src', e.target.result).fadeIn('slow');
                }
                reader.readAsDataURL(input.files[0]);
            }
        }

        $(window).resize(function () {
            $('.card-wizard').each(function () {
                $wizard = $(this);

                index = $wizard.bootstrapWizard('currentIndex');
                refreshAnimation($wizard, index);

                $('.moving-tab').css({
                    'transition': 'transform 0s'
                });
            });
        });

        function refreshAnimation($wizard, index) {
            $total = $wizard.find('.nav li').length;
            $li_width = 100 / $total;

            total_steps = $wizard.find('.nav li').length;
            move_distance = $wizard.width() / total_steps;
            index_temp = index;
            vertical_level = 0;

            mobile_device = $(document).width() < 600 && $total > 3;

            if (mobile_device) {
                move_distance = $wizard.width() / 2;
                index_temp = index % 2;
                $li_width = 50;
            }

            $wizard.find('.nav li').css('width', $li_width + '%');

            step_width = move_distance;
            move_distance = move_distance * index_temp;

            $current = index + 1;

            // if($current == 1 || (mobile_device == true && (index % 2 == 0) )){
            //     move_distance -= 8;
            // } else if($current == total_steps || (mobile_device == true && (index % 2 == 1))){
            //     move_distance += 8;
            // }

            if (mobile_device) {
                vertical_level = parseInt(index / 2);
                vertical_level = vertical_level * 38;
            }

            $wizard.find('.moving-tab').css('width', step_width);
            $('.moving-tab').css({
                'transform': 'translate3d(' + move_distance + 'px, ' + vertical_level + 'px, 0)',
                'transition': 'all 0.5s cubic-bezier(0.29, 1.42, 0.79, 1)'

            });
        }
    },

    initSliders: function () {
        // Sliders for demo purpose in refine cards section
        var slider = document.getElementById('sliderRegular');

        noUiSlider.create(slider, {
            start: 40,
            connect: [true, false],
            range: {
                min: 0,
                max: 100
            }
        });

        var slider2 = document.getElementById('sliderDouble');

        noUiSlider.create(slider2, {
            start: [20, 60],
            connect: true,
            range: {
                min: 0,
                max: 100
            }
        });
    },


    updateChart: function (data, pair) {
        //order the data by date/time
        function orderKeys(obj) {

            var keys = Object.keys(obj).sort(function keyOrder(k1, k2) {
                if (k1 < k2) return -1;
                else if (k1 > k2) return +1;
                else return 0;
            });

            var i, after = {};
            for (i = 0; i < keys.length; i++) {
                after[keys[i]] = obj[keys[i]];
                delete obj[keys[i]];
            }

            for (i = 0; i < keys.length; i++) {
                obj[keys[i]] = after[keys[i]];
            }
            return obj;
        }

        orderKeys(data);

        // Splits data into labels and x/y axis data points
        Object.keys(data).forEach(function (key) {
            var date = new Date(key).toLocaleString("en-US")
            labels.push(date);
            cleandata.push(data[key]);
        });
        chartColor = "#FFFFFF";

        // General configuration for the charts with Line gradientStroke
        gradientChartOptionsConfiguration = {
            maintainAspectRatio: false,
            legend: {
                display: false
            },
            tooltips: {
                bodySpacing: 4,
                mode: "nearest",
                intersect: 0,
                position: "nearest",
                xPadding: 10,
                yPadding: 10,
                caretPadding: 10
            },
            responsive: 1,
            scales: {
                yAxes: [{
                    display: 0,
                    gridLines: 0,
                    ticks: {
                        display: false
                    },
                    gridLines: {
                        zeroLineColor: "transparent",
                        drawTicks: false,
                        display: false,
                        drawBorder: false
                    }
                }],
                xAxes: [{
                    display: 0,
                    gridLines: 0,
                    ticks: {
                        display: false
                    },
                    gridLines: {
                        zeroLineColor: "transparent",
                        drawTicks: false,
                        display: false,
                        drawBorder: false
                    }
                }]
            },
            layout: {
                padding: {left: 0, right: 0, top: 15, bottom: 15}
            }
        };

        gradientChartOptionsConfigurationWithNumbersAndGrid = {
            maintainAspectRatio: false,
            legend: {
                display: false
            },
            tooltips: {
                bodySpacing: 4,
                mode: "nearest",
                intersect: 0,
                position: "nearest",
                xPadding: 10,
                yPadding: 10,
                caretPadding: 10,

            },
            hover: {mode: null},

            responsive: true,
            scales: {
                yAxes: [{
                    gridLines: 0,
                    gridLines: {
                        zeroLineColor: "transparent",
                        drawBorder: false
                    }
                }],
                xAxes: [{
                    display: 0,
                    gridLines: 0,
                    ticks: {
                        display: true
                    },
                    gridLines: {
                        zeroLineColor: "transparent",
                        drawTicks: false,
                        display: false,
                        drawBorder: false
                    }
                }]
            },
            layout: {
                padding: {left: 0, right: 0, top: 15, bottom: 15}
            }
        };

        var canvas = document.getElementById(pair + 'Chart');
        ctx = canvas.getContext("2d");
        var gradientStroke = ctx.createLinearGradient(500, 0, 100, 0);
      gradientStroke.addColorStop(0, '#80b6f4');
      gradientStroke.addColorStop(1, chartColor);

      var gradientFill = ctx.createLinearGradient(0, 200, 0, 50);
      gradientFill.addColorStop(0, "rgb(18, 204, 239, .20)");
      gradientFill.addColorStop(1, "rgba(255, 255, 255, 0.40)");
      Chart.defaults.global.defaultFontColor = "#ffffff";


        console.log(cleandata)

        var config = {
            type: 'line',
            responsive: true,
            data: {
                labels: labels,
                datasets: [{
                    label: "",
                    borderColor: "#FFF",
                    pointBorderColor: "#FFF",
                    pointBackgroundColor: "#18ce0f",
                    pointBorderWidth: 1,
                    pointHoverRadius: 4,
                    pointHoverBorderWidth: 1,
                    pointRadius: 3,
                    fill: true,
                    backgroundColor:gradientFill,
                    borderWidth: 2,
                    scaleFontColor: "#FFF",
                    fontColor: "#FFF",
                    data: cleandata,
                    drawBorder: true
                }]
            },
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            // Edit here for the yAxe
                            fontColor: "#FFF",
                            fontSize: 20,
                            padding: 200
                        }
                    }],
                    xAxes: [{
                        ticks: {
                            // Edit here for the xAxe
                            fontColor: "#FFF",
                            fontSize: 20
                        }
                    }]
                },
                layout: {
                    padding: {
                    left: 200,
                    right: 200,
                    top: 200,
                    bottom: 200
            }
        }
                },
            options: gradientChartOptionsConfigurationWithNumbersAndGrid
        }
    // plugin to add red and green arrows
//  Chart.plugins.register({
//    afterDatasetsDraw: function(c) {
//       let ctx = c.ctx;
//       let prevY;
//       c.data.datasets.forEach(function(e, i) {
//          let meta = c.getDatasetMeta(i);
//          if (meta.hidden) return;
//          meta.data.forEach(function(e) {
//             let x = e.tooltipPosition().x;
//             let y = e.tooltipPosition().y;
//             let radius = e._model.radius;
//             let moveY = prevY && (y < prevY ? y - (radius * 3) : y + (radius * 3));
//             let lineY = prevY && (y < prevY ? y - (radius * 2) : y + (radius * 2));
//             let color = prevY && (y < prevY ? 'green' : 'red');
//
//             // draw arrow
//             ctx.save();
//             ctx.fillStyle = color;
//             ctx.strokeStyle = color;
//
//             ctx.beginPath();
//             ctx.moveTo(x, moveY);
//             ctx.lineTo(x + radius, lineY);
//             ctx.lineTo(x - radius, lineY);
//             ctx.closePath();
//             ctx.stroke()
//             ctx.fill();
//             ctx.restore();
//             prevY = y;
//          })
//       });
//    }
// });
        myChart = new Chart(ctx, config);

    }

};



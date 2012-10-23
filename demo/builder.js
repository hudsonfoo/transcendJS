$(document).ready(function() {
    transcendJS({
        'wrapper': {
            'style': {
                'font-family': 'sans-serif',
                'font-size': '12px',
                'width': '90%',
                'alignment': 'center',
                'background-color': '#f1f1f1'
            },
            'children': {
                'header': {
                    'text': 'Header',
                    'style': {
                        'font-weight': 'bold',
                        'text-align': 'center',
                        'width': '100%',
                        'font-size': '20px'
                    },
                    'children': {
                        'motto': {
                            'style': {
                                'font-style': 'italic',
                                'font-size': '10px'
                            },
                            'text': 'Motto'
                        }
                    }
                },

                'content': {
                    'text': 'Content goes here',
                    'style': { 'padding': '20px' },
                    'children': {
                        'testButton': {
                            'style': {
                                'background-color':'#000',
                                'color':'#fff',
                                'width':'80px',
                                'padding':'10px',
                                'text-align':'center',
                                'alignment':'center',
                                'font-weight':'bold'
                            },
                            'text': 'Click Me',
                            'onClick': function() {
                                alert('Oh no you didn\'t!');
                            }
                        }
                    }
                },

                'footer': {
                    'text': 'Randomly aligned footer goes here',
                    'inheritStylesFrom': 'header',
                    'style': {
                        'text-align': function() { // An example of creating "live" styles
                            var alignments = ['left', 'center', 'right'],
                                randomNumber = Math.floor(Math.random() * 3);
                            return alignments[randomNumber];
                        }(),
                        'font-size': '10px'
                    }
                }
            }
        }
    });
});

const { createApp } = Vue

createApp({
    data() {
        return {
            eventosIndex: [],
            eventosCompletos: [],
            eventosPermanentes: [],
            eventosFuturos: [],
            eventosPasados: [],
            categorias: [],
            buscarElemento: "",
            elementosFiltrados: [],
            checksSelected: [],
            userLocation: location.href,
            elementoDetails: JSON.parse(localStorage.getItem("Evento")),
            eventosMayorPorcentajeAsistencia: [],
            eventosMenorPorcentajeAsistencia: [],
            largestCapacity: [],
            upcomingEventsByCategory: []




        }
    },
    created() {
        fetch("https://amazing-events.herokuapp.com/api/events")
            .then(arreglo => arreglo.json())
            .then(fullArray => {
                this.eventosIndex = fullArray
                this.eventosCompletos = fullArray.events
                this.eventosPermanentes = fullArray.events
                this.elementosFiltrados = fullArray.events
                console.log(this.userLocation);
                if (this.userLocation.includes("index.html")) {

                    this.userIsInIndex(this.eventosPermanentes);

                } else if (this.userLocation.includes("upcoming-events.html")) {
                    console.log("está en upcomings")

                    this.userUpcoming(this.eventosPermanentes);
                } else if (this.userLocation.includes("past-events.html")) {
                    this.userPast(this.eventosPermanentes);
                } else if (this.userLocation.includes("stats.html")) {
                    this.stats(this.eventosPermanentes);
                } else if (this.userLocation.includes("details.html")) {
                    console.log("detalles")
                    this.eventDetails();
                } else if (this.userLocation.includes("stats.html")) {
                    this.stats(this.eventosPermanentes);
                }


            })

    },
    methods: {
        userIsInIndex(eventosPermanentes) {
            this.eventosCompletos = eventosPermanentes;
            this.eventosPermanentes = eventosPermanentes;
            this.crearCategorias();

        },

        userUpcoming(eventosPermanentes) {

            this.eventosCompletos = eventosPermanentes.filter(filtrado => filtrado.date > this.eventosIndex.currentDate);
            this.eventosPermanentes = eventosPermanentes.filter(filtrado => filtrado.date < this.eventosIndex.currentDate);
            this.crearCategorias();

        },

        userPast(eventosPermanentes) {

            this.eventosCompletos = eventosPermanentes.filter(filtrado => filtrado.date < this.eventosIndex.currentDate);
            this.eventosPermanentes = eventosCompletos = eventosPermanentes.filter(filtrado => filtrado.date < this.eventosIndex.currentDate);
            this.crearCategorias();


        },
        eventDetails() {
            console.log("está en details");
            console.log(this.elementoDetails);


        },
        stats(eventosPermanentes) {
            this.eventosFuturos = eventosPermanentes.filter(filtrado => filtrado.date > this.eventosIndex.currentDate);
            this.eventosPasados = eventosPermanentes.filter(filtrado => filtrado.date < this.eventosIndex.currentDate);
            console.log(this.eventosPasados);
            this.statsCalculos(this.eventosPasados, this.eventosFuturos, this.eventosIndex.events);

            console.log("user in staats")
        },


        comprobarSearch() {


            this.elementosFiltrados = this.eventosPermanentes.filter(evento => evento.name.toLowerCase().includes(this.buscarElemento.toLowerCase()))
            console.log(this.elementosFiltrados);

        },
        crearCategorias() {
            console.log(this.eventosPermanentes);

            this.eventosPermanentes.forEach(evento => { this.categorias.push(evento.category) });
            console.log(this.categorias);
            this.categorias = [...new Set(this.categorias)];
            console.log(this.categorias);
        },
        cambiarElementos: function() {
            this.categorias = [];
            this.buscarElemento = "";

            this.elementosFiltrados = this.eventosPermanentes;
            this.checksSelected = [];
            this.crearCategorias();
        },
        almacenarElemento: function(evento) {
            localStorage.setItem("Evento", JSON.stringify(evento));
            console.log(evento);
            this.elementoDetails = evento;
            console.log(this.elementoDetails);
            console.log(localStorage.getItem("Evento", JSON.stringify(evento)))
        },

        abrirMenu: function() {
            let navegacion = document.getElementById("navegacion");
            navegacion.style.display = "flex";


        },
        cerrarMenu: function() {
            let navegacion = document.getElementById("navegacion");
            navegacion.style.display = "none";

        },
        statsCalculos(eventosPasados, eventosFuturos, eventosFullOriginales) {
            let eventosMayorPorcentajeAsistencia = [];
            let eventosMenorPorcentajeAsistencia = [];
            let largestCapacity = [];
            statsMayorPorcentajeDeAsistencia();
            statsMenorPorcentajeDeAsistencia();
            statsMayorCapacidad();
            let categoriasSimples = [];
            let arregloPrecio = [];
            let arregloEstimate = [];
            let upcomingEventsByCategory = [];
            tableTwo();
            let categoriasPasadas = [];
            let arregloPrecioPasado = [];
            let arregloEstimatePasado = [];
            let pastEventsByCategory = [];
            tableThree();


            function statsMayorPorcentajeDeAsistencia() {

                let mayorPorcentajePorEvento = 0;
                let mayorPorcentajeEncontrado = 0;


                for (let i = 0; i < eventosPasados.length; i++) {

                    mayorPorcentajePorEvento = eventosPasados[i].assistance * 100 / eventosPasados[i].capacity
                    console.log(mayorPorcentajePorEvento);
                    if (mayorPorcentajePorEvento > mayorPorcentajeEncontrado) {
                        mayorPorcentajeEncontrado = mayorPorcentajePorEvento;
                    }

                }
                console.log(mayorPorcentajeEncontrado);
                for (let i = 0; i < eventosPasados.length; i++) {
                    if (eventosPasados[i].assistance * 100 / eventosPasados[i].capacity === mayorPorcentajeEncontrado) {
                        eventosMayorPorcentajeAsistencia.push(eventosPasados[i]);
                    }
                }


            }
            this.eventosMayorPorcentajeAsistencia = eventosMayorPorcentajeAsistencia;
            console.log(this.eventosMayorPorcentajeAsistencia);

            function statsMenorPorcentajeDeAsistencia() {
                let menorPorcentajePorEvento = 0;
                let menorPorcentajeEncontrado = 100;


                for (let i = 0; i < eventosPasados.length; i++) {

                    menorPorcentajePorEvento = eventosPasados[i].assistance * 100 / eventosPasados[i].capacity
                    console.log(menorPorcentajePorEvento);
                    if (menorPorcentajePorEvento < menorPorcentajeEncontrado) {
                        menorPorcentajeEncontrado = menorPorcentajePorEvento;
                    }

                }
                console.log(menorPorcentajeEncontrado);
                for (let i = 0; i < eventosPasados.length; i++) {
                    if (eventosPasados[i].assistance * 100 / eventosPasados[i].capacity === menorPorcentajeEncontrado) {
                        eventosMenorPorcentajeAsistencia.push(eventosPasados[i]);
                    }
                }


            }
            this.eventosMenorPorcentajeAsistencia = eventosMenorPorcentajeAsistencia;
            console.log(this.eventosMenorPorcentajeAsistencia);

            function statsMayorCapacidad() {
                let mayorAMenorCapacidad = eventosFullOriginales.sort(function(a, b) { return b.capacity - a.capacity })
                largestCapacity = `${mayorAMenorCapacidad[0].name}, capacity: ${mayorAMenorCapacidad[0].capacity} `
            }

            this.largestCapacity = largestCapacity;



            function tableTwo() {
                let categorias = [];
                for (let i = 0; i < eventosFuturos.length; i++) {

                    categorias.push(eventosFuturos[i].category);

                }
                categoriasSimples = [...new Set(categorias)];
                console.log(categoriasSimples);



                categoriasSimples.forEach((posicion) => { arregloPrecio.push(0) });


                console.log(arregloPrecio);

                let cantidadEventosCategoria = [
                    [],
                    [],
                    [],
                    [],
                    [],
                    []
                ];
                for (let i = 0; i < eventosFuturos.length; i++) {
                    for (let c = 0; c < categoriasSimples.length; c++) {
                        if (eventosFuturos[i].category === categoriasSimples[c]) {
                            cantidadEventosCategoria[c].push(eventosFuturos[i]);
                            arregloPrecio[c] = arregloPrecio[c] + eventosFuturos[i].price * eventosFuturos[i].estimate;
                        }

                    }


                }






                for (let i = 0; i < cantidadEventosCategoria.length; i++) {
                    let porcentajeTest = 0;
                    cantidadEventosCategoria[i].forEach(elemento => {

                        porcentajeTest = (100 * elemento.estimate / elemento.capacity) + porcentajeTest;

                    })



                    porcentajeTest = Math.round(porcentajeTest / cantidadEventosCategoria[i].length);
                    porcentajeTest = `${porcentajeTest} %`
                    arregloEstimate.push(porcentajeTest);


                }
                console.log(arregloEstimate);

                upcomingEventsByCategory.push(categoriasSimples, arregloPrecio, arregloEstimate);
                console.log(upcomingEventsByCategory);

            }
            this.upcomingEventsByCategory = upcomingEventsByCategory;
            console.log(this.upcomingEventsByCategory[0][0]);

            function tableThree() {
                let categorias = [];
                for (let i = 0; i < eventosPasados.length; i++) {

                    categorias.push(eventosPasados[i].category);

                }
                categoriasPasadas = [...new Set(categorias)];
                console.log(categoriasPasadas);



                categoriasPasadas.forEach((posicion) => { arregloPrecioPasado.push(0) });


                console.log(arregloPrecio);

                let cantidadEventosCategoria = [
                    [],
                    [],
                    [],
                    [],
                    [],
                    [],
                    []
                ];
                console.log(eventosPasados);
                console.log(categoriasPasadas);
                console.log(cantidadEventosCategoria);
                for (let i = 0; i < eventosPasados.length; i++) {
                    for (let c = 0; c < categoriasPasadas.length; c++) {
                        console.log(eventosPasados[i].category);
                        console.log(categoriasPasadas[c]);
                        if (eventosPasados[i].category === categoriasPasadas[c]) {

                            cantidadEventosCategoria[c].push(eventosPasados[i]);
                            arregloPrecioPasado[c] = arregloPrecioPasado[c] + eventosPasados[i].price * eventosPasados[i].assistance;
                        }

                    }


                }

                for (let i = 0; i < cantidadEventosCategoria.length; i++) {
                    let porcentajeTest = 0;
                    cantidadEventosCategoria[i].forEach(elemento => {

                        porcentajeTest = (100 * elemento.assistance / elemento.capacity) + porcentajeTest;

                    })



                    porcentajeTest = Math.round(porcentajeTest / cantidadEventosCategoria[i].length);
                    porcentajeTest = `${porcentajeTest} %`
                    arregloEstimatePasado.push(porcentajeTest);
                    console.log(`${cantidadEventosCategoria[i][0].category}, ${porcentajeTest}`);

                }
                console.log(arregloEstimatePasado);

                pastEventsByCategory.push(categoriasPasadas, arregloPrecioPasado, arregloEstimatePasado);
                console.log(upcomingEventsByCategory);

            }
            this.pastEventsByCategory = pastEventsByCategory;
            console.log(this.pastEventsByCategory[0][0]);
        }


        /*
        userUpcomings: function() {
            this.eventosPermanentes = this.fullArray.events.filter((filtrado) => { filtrado.date > this.fullArray.currentDate });
            this.elementosFiltrados = this.eventosPermanentes;
            this.eventosCompletos = this.eventosPermanentes;
        }
        */

    },
    computed: {
        buscador() {
            if (this.buscarElemento.length === 0 && this.checksSelected.length === 0) {
                console.log("Estoy acá")
                this.elementosFiltrados = this.eventosPermanentes;

            } else if (this.buscarElemento.length > 0 && this.checksSelected.length === 0) {
                console.log("Estoy acá")
                this.mostrarElementos = [];

                this.eventosPermanentes.filter((evento) => {
                    if (evento.name.toLowerCase().includes(this.buscarElemento.toLowerCase())) {
                        this.mostrarElementos.push(evento);
                    }
                })
                this.elementosFiltrados = this.mostrarElementos;


            } else if (this.buscarElemento.length === 0 && this.checksSelected.length > 0) {
                console.log("Estoy acá")
                this.elementosFiltrados = []

                for (let i = 0; i < this.checksSelected.length; i++) {
                    this.eventosPermanentes.filter(evento => {
                            if (evento.category === this.checksSelected[i]) {
                                this.elementosFiltrados
                                    .push(evento);
                            }
                        }

                    )

                }
            } else if (this.buscarElemento.length > 0 && this.checksSelected.length > 0) {

                console.log("estoy acá");
                this.mostrarElementos = [];

                for (let i = 0; i < this.checksSelected.length; i++) {
                    this.eventosPermanentes.filter((evento) => {
                        if (evento.category === this.checksSelected[i] && evento.name.toLowerCase().includes(this.buscarElemento.toLowerCase())) {
                            this.mostrarElementos.push(evento)

                        }
                    })
                }
                if (this.mostrarElementos.length > 0) {
                    this.elementosFiltrados = this.mostrarElementos
                } else {
                    this.elementosFiltrados = [];
                }


            }



        }





        /*
        else {
            this.mostrarElementos = [];
            this.elementosFiltrados = this.eventosPermanentes;
            console.log(this.elementosFiltrados);
        }

        if (this.buscarElemento !== "") {
        this.comprobarSearch();

        } else {
        this.elementosFiltrados = this.eventosPermanentes;
        }
        */
    }

}).mount('#app')
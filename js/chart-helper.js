$(document).ready(function() {

    // Manipular escolha de variações no gráfico
    var lastElement = '';
    var data = null;
    var variacao = "" ;

    $('#appendedInput').change(function() {
        
        $("#appendedInput option:selected").each(function () {
            var selected = $(this).val();
            if (selected !== lastElement) {
                variacao = $(this).val();
            }
            
            lastElement = selected;
        });
    });

    $(document.body).on('click', '#gerar-grafico', function() {
        drawChart(variacao);
    });

    // Baseado no array selecionado para fitlro pelo usuário, percorremos todos os elementos,
    // verificamos se aquele índice já existe, se sim, incrementamos o número de repetições,
    // senão, criamos um novo índice e armazenamos também as repetições que ele percorre.
    function countInArray(array) {
        console.log("Recebido: " + array);
        var arrayAuxiliar = [];
        var arr = array.length,
            len, i;

        for (i = 0, len = arr; i < len; i++) {

            if (arrayAuxiliar[array[i]] >= 1) {
                arrayAuxiliar[array[i]]++;
            }
            else {
                arrayAuxiliar[array[i]] = 1;
            }
        }
        return arrayAuxiliar;
    }

    // Função para validar string
    var toString = Object.prototype.toString;
    _isString = function (obj) {
        return toString.call(obj) == '[object String]';
    }

    // Callback that creates and populates a data table,
    // instantiates the pie chart, passes in the data and
    // draws it.
    function drawChart(variacao) {

        // Variacao precisar ter exatamente o mesmo nome, tanto no cabecalho quanto no selectbox
        // O id dos elementos do cabecalho precisam ter o mesmo valor do nome em exibição, pois virão dinâmicamente
        // e este modo é o mais simples para obter.

        // Criando a tabela.
        data = new google.visualization.DataTable();
        var arrayColunasSelecionadas = [];
        var colunasAplicadas;

        // A função index() do jQuery inicia em 0. 
        // Portanto, caso a coluna seja a número 2, o index será 1 e assim adiante.
        // Obtemos a posição em que a coluna selecionada pelo usuário está.
        var posicaoColuna = $("tr:first th#"+variacao).index() + 1;

        // Obtemos aqui todos os registros abaixo do header da coluna selecionada.
        colunasAplicadas = $("#result-report-table tr td:nth-child(" + posicaoColuna + ")");

        // Para cada coluna que iremos buscar, precisaremos ver o conteúdo da mesma,
        // Caso seja igual, criar um objeto com seu id, nome e a quantidade de vezes que este registro aparece
        $(colunasAplicadas).each(function(indexColuna, valorColuna) {
            // Dentro deste loop, criamos um array armazenando todas os registros existentes na coluna selecionada.
            arrayColunasSelecionadas.push($(this).text());
        });

        data.addColumn('string', variacao);
        data.addColumn('number', variacao);

        // A variável objetoFiltrado receberá um array contendo [quantidade e descrição].
        // Este array é populado na função que chamamos passando como parâmetro todas as colunas selecionadas
        // a partir da escolha do usuário.
        var objetoFiltrado = countInArray(arrayColunasSelecionadas);

        // Iteramos o array recebido
        // item é a chave, objetoFiltrao[item] é o valor.
        // descrição e quantidade, respectivamente.
        for (item in objetoFiltrado) {
            console.log(item);
            console.log(objetoFiltrado[item]);
            data.addRow([item, objetoFiltrado[item]]);
        }
            
        var options = {'title':'Gráfico',
                       'width':600,
                       'height':300,
                       is3D: true};

        var chart = new google.visualization.ColumnChart(document.getElementById('chart_div'));
        chart.draw(data, options);
    }
}); 
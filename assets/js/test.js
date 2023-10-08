const selectorOption = document.querySelector(".coinSelector");
const getValueBtn = document.querySelector(".convertButton");
const pesosInputValue = document.querySelector(".pesosInput");
const result = document.querySelector(".result");
var chart;

function configureGraphic(dataSeries) {
  dataSeries = dataSeries.slice(0, 10);
  const type = "line";
  let name = dataSeries.map((data) => data.fecha);
  name = dateFormat(name.reverse());
  const tittle = "Historial ultimos 10 dias";
  let values = dataSeries.map((data) => {
    const value = Number(data.valor);
    return value;
  });
  values = values.reverse();
  const dataObject = {
    type: type,
    data: {
      labels: name,
      datasets: [
        {
          label: tittle,
          data: values,
        },
      ],
    },
    options: {
      maintainAspectRatio: false,
    },
  };
  return dataObject;
}

function dateFormat(dates) {
  const formatDate = dates.map((date) => {
    format = new Date(date);
    let year = format.getFullYear();
    let month = format.getMonth();
    let day = format.getDate();
    return `${year}-${month}-${day}`;
  });
  return formatDate;
}

async function renderGraphic(value) {
  if (chart) {
    chart.destroy();
  }
  const changeValue = await getChangeType(value);
  const config = configureGraphic(changeValue);
  console.log(config);
  const chartDOM = document.getElementById("myChart");
  chartDOM.style.backgroundColor = "white";
  chart = new Chart(chartDOM, config);
}

async function getChangeType(newCoin) {
  try {
    let changeValue;
    let coinSymbol;
    let jsonRes;
    if (newCoin == "dolar") {
      const res = await fetch("https://mindicador.cl/api/dolar");
      jsonRes = await res.json();

      coinSymbol = "$";
    } else if (newCoin == "euro") {
      const res = await fetch("https://mindicador.cl/api/euro");
      jsonRes = await res.json();
      coinSymbol = "€";
    }
    changeValue = jsonRes.serie[0].valor;
    convertCoin(changeValue, pesosInputValue.value, coinSymbol);
    return jsonRes.serie;
  } catch (e) {
    alert(e.message);
  }
}

function convertCoin(changeValue, pesosValue, symbol) {
  const newValue = Math.round((pesosValue / changeValue) * 100) / 100;
  result.innerHTML = `Resultado: ${symbol} ${newValue}`;
}

getValueBtn.addEventListener("click", () => {
  renderGraphic(selectorOption.value);
});

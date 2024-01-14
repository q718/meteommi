function search() {
  var city = document.getElementById("city").value;
  fetch(
    "https://geocoding-api.open-meteo.com/v1/search?name=" +
      city +
      "&count=1&language=fr&format=json",
  )
    .then((res) => res.json())
    .then((res) => {
      if (res.status) {
        console.log(res.reason);
      } else {
        if (res.results != null) {
          document.getElementById("city").value = JSON.parse(
            JSON.stringify(res.results[0].name),
          );
          latitude = JSON.parse(JSON.stringify(res.results[0].latitude));
          longitude = JSON.parse(JSON.stringify(res.results[0].longitude));
          console.log(res);
          unit = document.getElementById("unit").value;
          fetch(
            "https://api.open-meteo.com/v1/forecast?latitude=" +
              latitude +
              "&longitude=" +
              longitude +
              "&current=temperature_2m&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m,wind_direction_10m,wind_gusts_10m&hourly=temperature_2m,relative_humidity_2m,apparent_temperature,cloud_cover_low,cloud_cover_mid,cloud_cover_high,wind_speed_10m,wind_direction_10m,wind_gusts_10m,uv_index,uv_index_clear_sky,sunshine_duration&daily=weather_code,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,wind_speed_10m_max,wind_gusts_10m_max,wind_direction_10m_dominant&temperature_unit=" +
              unit +
              "&timezone=auto&forecast_days=7",
          )
            .then((res) => res.json())
            .then((res) => {
              if (res.status) {
                console.log(res.reason);
              } else {
                document.getElementById("time").value = JSON.parse(
                  JSON.stringify(res.current.time),
                );
                function wmo2txt(wmo) {
                  if (wmo > 95) return "Très orageux";
                  if (wmo == 95) return "Orageux";
                  if (wmo > 79) return "Très pluvieux";
                  if (wmo > 60) return "Pluvieux";
                  if (wmo > 48) return "Nuageux";
                  if (wmo > 0) {
                    return "Couvert";
                  }
                  return "Clair";
                }
                document.getElementById("illu").innerHTML =
                  "<img src='img/icons/" +
                  wmo2txt(
                    JSON.parse(JSON.stringify(res.current.weather_code)),
                  ) +
                  ".png'></img><p>" +
                  wmo2txt(
                    JSON.parse(JSON.stringify(res.current.weather_code)),
                  ) +
                  "</p>";
                document.getElementById("tm").innerHTML =
                  JSON.parse(JSON.stringify(res.current.temperature_2m)) +
                  JSON.parse(JSON.stringify(res.current_units.temperature_2m));
                document.getElementById("at").innerHTML =
                  JSON.parse(JSON.stringify(res.current.apparent_temperature)) +
                  JSON.parse(JSON.stringify(res.current_units.temperature_2m)) +
                  " ressenti";
                function deg2txt(degree) {
                  if (degree > 337.5) return "Nord";
                  if (degree > 292.5) return "Nord-ouest";
                  if (degree > 247.5) return "Ouest";
                  if (degree > 202.5) return "Sud-ouest";
                  if (degree > 157.5) return "Sud";
                  if (degree > 122.5) return "Sud-est";
                  if (degree > 67.5) return "Est";
                  if (degree > 22.5) {
                    return "Nord-est";
                  }
                  return "Nord";
                }
                document.getElementById("di").innerHTML =
                  "<i class='fa fa-compass'></i> Vent <b>" +
                  deg2txt(
                    JSON.parse(JSON.stringify(res.current.wind_direction_10m)),
                  ) +
                  "</b> (" +
                  JSON.parse(JSON.stringify(res.current.wind_direction_10m)) +
                  JSON.parse(
                    JSON.stringify(res.current_units.wind_direction_10m),
                  ) +
                  ")";
                document.getElementById("vi").innerHTML =
                  "<i class='fa fa-gauge-simple'></i> " +
                  JSON.parse(JSON.stringify(res.current.wind_speed_10m)) +
                  " " +
                  JSON.parse(JSON.stringify(res.current_units.wind_speed_10m));
                document.getElementById("ra").innerHTML =
                  "<i class='fa fa-wind'></i> Rafales à " +
                  JSON.parse(JSON.stringify(res.current.wind_gusts_10m)) +
                  " " +
                  JSON.parse(JSON.stringify(res.current_units.wind_gusts_10m));
                document.getElementById("vt").innerHTML = "<i class='fa fa-sort'></i> " +
                  eval(
                    JSON.parse(
                      JSON.stringify(res.daily.temperature_2m_max[0]),
                    ) -
                      JSON.parse(
                        JSON.stringify(res.daily.temperature_2m_min[0]),
                      ),
                  ).toFixed(1) + "° de variation";
                document.getElementById("rh").innerHTML =
                  JSON.parse(JSON.stringify(res.current.relative_humidity_2m)) +
                  JSON.parse(
                    JSON.stringify(res.current_units.relative_humidity_2m),
                  ) +
                  " d'humidité";
                document.getElementById("pr").innerHTML =
                  "<u>Précipitation :</u> " +
                  JSON.parse(JSON.stringify(res.current.precipitation)) +
                  JSON.parse(JSON.stringify(res.current_units.precipitation));
                document.getElementById("wmo").innerHTML =
                  "wmo#" + JSON.parse(JSON.stringify(res.current.weather_code));

                const periods = ["ma", "mi", "ap", "so"];
                periods.forEach((period, index) => {
                  const hour = 8 + index * 4;
                  document.getElementById(`${period}t2`).innerHTML =
                    "Température<br>" +
                    JSON.parse(
                      JSON.stringify(res.hourly.temperature_2m[hour]),
                    ) +
                    JSON.parse(JSON.stringify(res.hourly_units.temperature_2m));
                  document.getElementById(`${period}at`).innerHTML =
                    "ressentie<br>" +
                    JSON.parse(
                      JSON.stringify(res.hourly.apparent_temperature[hour]),
                    ) +
                    JSON.parse(
                      JSON.stringify(res.hourly_units.apparent_temperature),
                    );
                  document.getElementById(`${period}lo`).innerHTML =
                    "Basse<br>" +
                    JSON.parse(
                      JSON.stringify(res.hourly.cloud_cover_low[hour]),
                    ) +
                    JSON.parse(
                      JSON.stringify(res.hourly_units.cloud_cover_low),
                    );
                  document.getElementById(`${period}mi`).innerHTML =
                    "Moyenne<br>" +
                    JSON.parse(
                      JSON.stringify(res.hourly.cloud_cover_mid[hour]),
                    ) +
                    JSON.parse(
                      JSON.stringify(res.hourly_units.cloud_cover_mid),
                    );
                  document.getElementById(`${period}hi`).innerHTML =
                    "Haute<br>" +
                    JSON.parse(
                      JSON.stringify(res.hourly.cloud_cover_high[hour]),
                    ) +
                    JSON.parse(
                      JSON.stringify(res.hourly_units.cloud_cover_high),
                    );
                  document.getElementById(`${period}rh`).innerHTML =
                    JSON.parse(
                      JSON.stringify(res.hourly.relative_humidity_2m[hour]),
                    ) +
                    JSON.parse(
                      JSON.stringify(res.hourly_units.relative_humidity_2m),
                    ) +
                    " d'humidité";
                  document.getElementById(`${period}sd`).innerHTML =
                    JSON.parse(
                      JSON.stringify(res.hourly.sunshine_duration[hour]),
                    ) +
                    JSON.parse(
                      JSON.stringify(res.hourly_units.sunshine_duration),
                    ) +
                    " d'ensoleillement";
                  document.getElementById(`${period}ui`).innerHTML =
                    "<u>Indice UV :</u> " +
                    JSON.parse(JSON.stringify(res.hourly.uv_index[hour]));
                  document.getElementById(`${period}um`).innerHTML =
                    "max=" +
                    JSON.parse(
                      JSON.stringify(res.hourly.uv_index_clear_sky[hour]),
                    );
                  document.getElementById(`${period}wd`).innerHTML =
                    "<i class='fa fa-compass'></i><br>" +
                    JSON.parse(
                      JSON.stringify(res.hourly.wind_direction_10m[hour]),
                    ) +
                    JSON.parse(
                      JSON.stringify(res.hourly_units.wind_direction_10m),
                    );
                  document.getElementById(`${period}ws`).innerHTML =
                    "<i class='fa fa-gauge-simple'></i><br>" +
                    JSON.parse(
                      JSON.stringify(res.hourly.wind_speed_10m[hour]),
                    ) +
                    JSON.parse(JSON.stringify(res.hourly_units.wind_speed_10m));
                  document.getElementById(`${period}wg`).innerHTML =
                    "<i class='fa fa-wind'></i><br>" +
                    JSON.parse(
                      JSON.stringify(res.hourly.wind_gusts_10m[hour]),
                    ) +
                    JSON.parse(JSON.stringify(res.hourly_units.wind_gusts_10m));
                });

                for (i = 1; i < 7; i++) {
                  document.getElementById(`d${i}`).innerHTML = JSON.parse(
                    JSON.stringify(res.daily.time[i]),
                  );
                  document.getElementById(`i${i}`).innerHTML =
                    "<img src='img/icons/" +
                    wmo2txt(
                      JSON.parse(JSON.stringify(res.daily.weather_code[i])),
                    ) +
                    ".png'></img>";
                  document.getElementById(`t${i}`).innerHTML =
                    "<b>" +
                    eval(
                      (JSON.parse(
                        JSON.stringify(res.daily.temperature_2m_max[i]),
                      ) +
                        JSON.parse(
                          JSON.stringify(res.daily.temperature_2m_min[i]),
                        )) /
                        2,
                    ).toFixed(1) +
                    JSON.parse(
                      JSON.stringify(res.daily_units.temperature_2m_max),
                    ) +
                    "</b>";
                  document.getElementById(`tt${i}`).innerHTML =
                    eval(
                      (JSON.parse(
                        JSON.stringify(res.daily.apparent_temperature_max[i]),
                      ) +
                        JSON.parse(
                          JSON.stringify(res.daily.apparent_temperature_max[i]),
                        )) /
                        2,
                    ).toFixed(1) +
                    JSON.parse(
                      JSON.stringify(res.daily_units.apparent_temperature_max),
                    ) +
                    " ressenti";
                  document.getElementById(`v${i}`).innerHTML =
                    "<i class='fa fa-compass'></i> " +
                    deg2txt(
                      JSON.parse(
                        JSON.stringify(
                          res.daily.wind_direction_10m_dominant[i],
                        ),
                      ),
                    );
                  document.getElementById(`vv${i}`).innerHTML =
                    "<i class='fa fa-gauge-simple'></i> " +
                    JSON.parse(
                      JSON.stringify(res.daily.wind_speed_10m_max[i]),
                    ) +
                    JSON.parse(
                      JSON.stringify(res.daily_units.wind_speed_10m_max),
                    );
                  document.getElementById(`vvv${i}`).innerHTML =
                    "<i class='fa fa-wind'></i> " +
                    JSON.parse(
                      JSON.stringify(res.daily.wind_gusts_10m_max[i]),
                    ) +
                    JSON.parse(
                      JSON.stringify(res.daily_units.wind_gusts_10m_max),
                    );
                  if (i == 1) {
                    document.getElementById("d1").innerHTML = "Demain";
                  }
                  if (i == 2) {
                    document.getElementById("d2").innerHTML = "Après-demain";
                  }
                  console.log(res);
                }
              }
            })
            .catch((e) => console.log(e));
        } else {
          alert("Veuillez renseignez un nom de ville valide !");
        }
      }
    })
    .catch((e) => console.log(e));
}

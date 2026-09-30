import React, { useEffect, useState } from "react";

import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import * as DocumentPicker from "expo-document-picker";

const STORAGE_KEY = "gastos_control_vehicular";

const VEHICULOS = [
  "Toyota Corolla",
  "Toyota Hilux",
  "Hyundai Accent",
  "Kia Sportage",
  "Nissan Frontier",
];

const CATEGORIAS = [
  "Combustible",
  "Mantenimiento",
  "Reparación",
  "Aceite",
  "Llantas",
  "Lavado",
  "Repuestos",
  "Seguro",
  "Impuestos",
  "Otros",
];

const MESES = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];

const DIAS_SEMANA = [
  "Dom",
  "Lun",
  "Mar",
  "Mié",
  "Jue",
  "Vie",
  "Sáb",
];

export default function App() {
  // ==========================================
  // FORMULARIO
  // ==========================================

  const [vehiculo, setVehiculo] = useState("");
  const [categoria, setCategoria] = useState("");
  const [monto, setMonto] = useState("");
  const [fecha, setFecha] = useState("");
  const [factura, setFactura] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [archivo, setArchivo] = useState(null);

  // ==========================================
  // CRUD
  // ==========================================

  const [gastos, setGastos] = useState([]);
  const [editandoId, setEditandoId] = useState(null);

  // ==========================================
  // DROPDOWNS
  // ==========================================

  const [mostrarVehiculos, setMostrarVehiculos] =
    useState(false);

  const [mostrarCategorias, setMostrarCategorias] =
    useState(false);

  // ==========================================
  // CALENDARIO
  // ==========================================

  const [mostrarCalendario, setMostrarCalendario] =
    useState(false);

  const [fechaCalendario, setFechaCalendario] =
    useState(new Date());

  // ==========================================
  // CARGAR GASTOS
  // ==========================================

  useEffect(() => {
    cargarGastos();
  }, []);

  const cargarGastos = async () => {
    try {
      const datos = await AsyncStorage.getItem(
        STORAGE_KEY
      );

      if (datos) {
        setGastos(JSON.parse(datos));
      }
    } catch (error) {
      console.log(error);
    }
  };

  // ==========================================
  // GUARDAR GASTOS
  // ==========================================

  const guardarDatos = async (lista) => {
    try {
      await AsyncStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(lista)
      );

      setGastos(lista);
    } catch (error) {
      console.log(error);
    }
  };

  // ==========================================
  // FORMATEAR FECHA
  // ==========================================

  const formatearFecha = (date) => {
    const dia = String(date.getDate()).padStart(
      2,
      "0"
    );

    const mes = String(
      date.getMonth() + 1
    ).padStart(2, "0");

    const año = date.getFullYear();

    return `${dia}/${mes}/${año}`;
  };

  // ==========================================
  // ABRIR CALENDARIO
  // ==========================================

  const abrirCalendario = () => {
    setMostrarVehiculos(false);
    setMostrarCategorias(false);
    setMostrarCalendario(true);
  };

  // ==========================================
  // CAMBIAR MES
  // ==========================================

  const cambiarMes = (cantidad) => {
    const nuevaFecha = new Date(
      fechaCalendario
    );

    nuevaFecha.setMonth(
      nuevaFecha.getMonth() + cantidad
    );

    setFechaCalendario(nuevaFecha);
  };

  // ==========================================
  // SELECCIONAR DÍA
  // ==========================================

  const seleccionarDia = (dia) => {
    const nuevaFecha = new Date(
      fechaCalendario.getFullYear(),
      fechaCalendario.getMonth(),
      dia
    );

    setFechaCalendario(nuevaFecha);

    setFecha(
      formatearFecha(nuevaFecha)
    );

    setMostrarCalendario(false);
  };

  // ==========================================
  // OBTENER DÍAS DEL MES
  // ==========================================

  const obtenerDiasMes = () => {
    const año =
      fechaCalendario.getFullYear();

    const mes =
      fechaCalendario.getMonth();

    const primerDia = new Date(
      año,
      mes,
      1
    ).getDay();

    const cantidadDias = new Date(
      año,
      mes + 1,
      0
    ).getDate();

    const dias = [];

    for (
      let i = 0;
      i < primerDia;
      i++
    ) {
      dias.push(null);
    }

    for (
      let dia = 1;
      dia <= cantidadDias;
      dia++
    ) {
      dias.push(dia);
    }

    return dias;
  };

  // ==========================================
  // SELECCIONAR ARCHIVO
  // ==========================================

  const seleccionarArchivo =
    async () => {
      try {
        const resultado =
          await DocumentPicker.getDocumentAsync(
            {
              type: [
                "image/*",
                "application/pdf",
              ],
              copyToCacheDirectory: true,
            }
          );

        if (!resultado.canceled) {
          const documento =
            resultado.assets[0];

          setArchivo(documento);
        }
      } catch (error) {
        Alert.alert(
          "Error",
          "No se pudo seleccionar el comprobante."
        );
      }
    };

  // ==========================================
  // LIMPIAR FORMULARIO
  // ==========================================

  const limpiarFormulario = () => {
    setVehiculo("");
    setCategoria("");
    setMonto("");
    setFecha("");
    setFactura("");
    setDescripcion("");
    setArchivo(null);
    setEditandoId(null);

    setMostrarVehiculos(false);
    setMostrarCategorias(false);
    setMostrarCalendario(false);

    setFechaCalendario(new Date());
  };

  // ==========================================
  // CREAR / ACTUALIZAR
  // ==========================================

  const guardarGasto = async () => {
    if (
      !vehiculo ||
      !categoria ||
      !monto ||
      !fecha
    ) {
      Alert.alert(
        "Campos obligatorios",
        "Completa Vehículo, Categoría, Monto y Fecha."
      );

      return;
    }

    // ACTUALIZAR
    if (editandoId) {
      const listaActualizada =
        gastos.map((item) => {
          if (item.id === editandoId) {
            return {
              ...item,

              vehiculo,
              categoria,
              monto,
              fecha,
              factura,
              descripcion,

              archivo:
                archivo?.name ||
                item.archivo ||
                null,
            };
          }

          return item;
        });

      await guardarDatos(
        listaActualizada
      );

      Alert.alert(
        "Gasto actualizado",
        "El gasto fue actualizado correctamente."
      );

      limpiarFormulario();

      return;
    }

    // CREAR
    const nuevoGasto = {
      id: Date.now().toString(),

      vehiculo,
      categoria,
      monto,
      fecha,
      factura,
      descripcion,

      archivo:
        archivo?.name || null,
    };

    const nuevaLista = [
      nuevoGasto,
      ...gastos,
    ];

    await guardarDatos(nuevaLista);

    Alert.alert(
      "Registro exitoso",
      "El gasto fue registrado correctamente."
    );

    limpiarFormulario();
  };

  // ==========================================
  // EDITAR
  // ==========================================

  const editarGasto = (item) => {
    setEditandoId(item.id);

    setVehiculo(item.vehiculo);
    setCategoria(item.categoria);
    setMonto(item.monto);
    setFecha(item.fecha);

    setFactura(
      item.factura || ""
    );

    setDescripcion(
      item.descripcion || ""
    );

    if (item.archivo) {
      setArchivo({
        name: item.archivo,
      });
    } else {
      setArchivo(null);
    }

    // Recuperar fecha en calendario
    if (item.fecha) {
      const partes =
        item.fecha.split("/");

      if (partes.length === 3) {
        const dia =
          Number(partes[0]);

        const mes =
          Number(partes[1]) - 1;

        const año =
          Number(partes[2]);

        const fechaEditada =
          new Date(
            año,
            mes,
            dia
          );

        setFechaCalendario(
          fechaEditada
        );
      }
    }

    setMostrarCalendario(false);
  };

  // ==========================================
  // ELIMINAR
  // ==========================================

  const eliminarGasto = (id) => {
    Alert.alert(
      "Eliminar gasto",
      "¿Deseas eliminar este gasto?",

      [
        {
          text: "Cancelar",
          style: "cancel",
        },

        {
          text: "Eliminar",
          style: "destructive",

          onPress: async () => {
            const nuevaLista =
              gastos.filter(
                (item) =>
                  item.id !== id
              );

            await guardarDatos(
              nuevaLista
            );

            if (
              editandoId === id
            ) {
              limpiarFormulario();
            }
          },
        },
      ]
    );
  };

  // ==========================================
  // RENDER
  // ==========================================

  return (
    <SafeAreaView
      style={styles.container}
    >
      <ScrollView
        showsVerticalScrollIndicator={
          false
        }
        contentContainerStyle={
          styles.scroll
        }
      >

        {/* ==================================
            HEADER
        ================================== */}

        <View style={styles.header}>

          <View
            style={
              styles.brandContainer
            }
          >
            <View style={styles.logo}>
              <Text
                style={
                  styles.logoText
                }
              >
                🚗
              </Text>
            </View>

            <View>
              <Text
                style={styles.brand}
              >
                Control Vehicular
              </Text>

              <Text
                style={
                  styles.brandSub
                }
              >
                Gestión de gastos
              </Text>
            </View>
          </View>

          <View
            style={styles.headerIcons}
          >
            <Text style={styles.bell}>
              🔔
            </Text>

            <View
              style={styles.userCircle}
            >
              <Text
                style={
                  styles.userText
                }
              >
                U
              </Text>
            </View>
          </View>
        </View>

        {/* ==================================
            TITULO
        ================================== */}

        <View
          style={
            styles.titleContainer
          }
        >
          <View>
            <Text style={styles.title}>
              {editandoId
                ? "Editar gasto"
                : "Registrar gasto"}
            </Text>

            <Text
              style={
                styles.subtitle
              }
            >
              Registra los gastos de tu vehículo
            </Text>
          </View>

          {editandoId && (
            <TouchableOpacity
              onPress={
                limpiarFormulario
              }
            >
              <Text
                style={
                  styles.cancelTop
                }
              >
                Cancelar edición
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* ==================================
            FORMULARIO
        ================================== */}

        <View style={styles.form}>

          {/* VEHÍCULO */}

          <Text style={styles.label}>
            Vehículo
            <Text
              style={
                styles.required
              }
            >
              {" "}*
            </Text>
          </Text>

          <TouchableOpacity
            style={
              styles.selectBox
            }
            onPress={() => {
              setMostrarVehiculos(
                !mostrarVehiculos
              );

              setMostrarCategorias(
                false
              );

              setMostrarCalendario(
                false
              );
            }}
          >
            <Text
              style={
                vehiculo
                  ? styles.selectText
                  : styles.placeholder
              }
            >
              {vehiculo ||
                "Seleccionar vehículo"}
            </Text>

            <Text
              style={styles.arrow}
            >
              {mostrarVehiculos
                ? "▲"
                : "▼"}
            </Text>
          </TouchableOpacity>

          {mostrarVehiculos && (
            <View
              style={
                styles.dropdown
              }
            >
              {VEHICULOS.map(
                (item) => (
                  <TouchableOpacity
                    key={item}
                    style={
                      styles.dropdownItem
                    }
                    onPress={() => {
                      setVehiculo(
                        item
                      );

                      setMostrarVehiculos(
                        false
                      );
                    }}
                  >
                    <Text
                      style={
                        styles.dropdownText
                      }
                    >
                      {item}
                    </Text>
                  </TouchableOpacity>
                )
              )}
            </View>
          )}

          {/* CATEGORÍA */}

          <Text style={styles.label}>
            Categoría
            <Text
              style={
                styles.required
              }
            >
              {" "}*
            </Text>
          </Text>

          <TouchableOpacity
            style={
              styles.selectBox
            }
            onPress={() => {
              setMostrarCategorias(
                !mostrarCategorias
              );

              setMostrarVehiculos(
                false
              );

              setMostrarCalendario(
                false
              );
            }}
          >
            <Text
              style={
                categoria
                  ? styles.selectText
                  : styles.placeholder
              }
            >
              {categoria ||
                "Seleccionar categoría"}
            </Text>

            <Text
              style={styles.arrow}
            >
              {mostrarCategorias
                ? "▲"
                : "▼"}
            </Text>
          </TouchableOpacity>

          {mostrarCategorias && (
            <View
              style={
                styles.dropdown
              }
            >
              {CATEGORIAS.map(
                (item) => (
                  <TouchableOpacity
                    key={item}
                    style={
                      styles.dropdownItem
                    }
                    onPress={() => {
                      setCategoria(
                        item
                      );

                      setMostrarCategorias(
                        false
                      );
                    }}
                  >
                    <Text
                      style={
                        styles.dropdownText
                      }
                    >
                      {item}
                    </Text>
                  </TouchableOpacity>
                )
              )}
            </View>
          )}

          {/* MONTO */}

          <Text style={styles.label}>
            Monto USD
            <Text
              style={
                styles.required
              }
            >
              {" "}*
            </Text>
          </Text>

          <View
            style={
              styles.amountBox
            }
          >
            <Text
              style={
                styles.currency
              }
            >
              $
            </Text>

            <TextInput
              style={
                styles.amountInput
              }
              placeholder="0.00"
              placeholderTextColor="#9CA3AF"
              value={monto}
              onChangeText={
                setMonto
              }
              keyboardType="decimal-pad"
            />
          </View>

          {/* FECHA */}

          <Text style={styles.label}>
            Fecha
            <Text
              style={
                styles.required
              }
            >
              {" "}*
            </Text>
          </Text>

          <TouchableOpacity
            style={
              styles.selectBox
            }
            onPress={
              abrirCalendario
            }
            activeOpacity={0.7}
          >
            <Text
              style={
                fecha
                  ? styles.selectText
                  : styles.placeholder
              }
            >
              {fecha ||
                "Seleccionar fecha"}
            </Text>

            <Text
              style={
                styles.calendarIcon
              }
            >
              📅
            </Text>
          </TouchableOpacity>

          {/* CALENDARIO */}

          {mostrarCalendario && (
            <View
              style={
                styles.calendario
              }
            >

              <View
                style={
                  styles.calendarioHeader
                }
              >

                <TouchableOpacity
                  style={
                    styles.mesButton
                  }
                  onPress={() =>
                    cambiarMes(-1)
                  }
                >
                  <Text
                    style={
                      styles.mesButtonText
                    }
                  >
                    ‹
                  </Text>
                </TouchableOpacity>

                <Text
                  style={
                    styles.mesTitulo
                  }
                >
                  {
                    MESES[
                      fechaCalendario.getMonth()
                    ]
                  }{" "}
                  {
                    fechaCalendario.getFullYear()
                  }
                </Text>

                <TouchableOpacity
                  style={
                    styles.mesButton
                  }
                  onPress={() =>
                    cambiarMes(1)
                  }
                >
                  <Text
                    style={
                      styles.mesButtonText
                    }
                  >
                    ›
                  </Text>
                </TouchableOpacity>

              </View>

              {/* DÍAS DE LA SEMANA */}

              <View
                style={
                  styles.diasSemana
                }
              >
                {DIAS_SEMANA.map(
                  (dia) => (
                    <Text
                      key={dia}
                      style={
                        styles.diaSemana
                      }
                    >
                      {dia}
                    </Text>
                  )
                )}
              </View>

              {/* DÍAS */}

              <View
                style={
                  styles.diasGrid
                }
              >
                {obtenerDiasMes().map(
                  (dia, index) => {

                    if (
                      dia === null
                    ) {
                      return (
                        <View
                          key={index}
                          style={
                            styles.diaVacio
                          }
                        />
                      );
                    }

                    const fechaDia =
                      new Date(
                        fechaCalendario.getFullYear(),
                        fechaCalendario.getMonth(),
                        dia
                      );

                    const fechaDiaTexto =
                      formatearFecha(
                        fechaDia
                      );

                    const seleccionado =
                      fecha ===
                      fechaDiaTexto;

                    return (
                      <TouchableOpacity
                        key={index}
                        style={[
                          styles.diaButton,

                          seleccionado &&
                            styles.diaSeleccionado,
                        ]}
                        onPress={() =>
                          seleccionarDia(
                            dia
                          )
                        }
                      >
                        <Text
                          style={[
                            styles.diaTexto,

                            seleccionado &&
                              styles.diaTextoSeleccionado,
                          ]}
                        >
                          {dia}
                        </Text>
                      </TouchableOpacity>
                    );
                  }
                )}
              </View>

              <TouchableOpacity
                style={
                  styles.cerrarCalendario
                }
                onPress={() =>
                  setMostrarCalendario(
                    false
                  )
                }
              >
                <Text
                  style={
                    styles.cerrarCalendarioTexto
                  }
                >
                  Cerrar calendario
                </Text>
              </TouchableOpacity>

            </View>
          )}

          {/* FACTURA */}

          <View
            style={
              styles.labelRow
            }
          >
            <Text
              style={styles.label}
            >
              N.º de Comprobante / Factura
            </Text>

            <Text
              style={
                styles.optional
              }
            >
              Opcional
            </Text>
          </View>

          <TextInput
            style={
              styles.normalInput
            }
            placeholder="Ej. FAC-001234"
            placeholderTextColor="#9CA3AF"
            value={factura}
            onChangeText={
              setFactura
            }
          />

          {/* DESCRIPCIÓN */}

          <View
            style={
              styles.labelRow
            }
          >
            <Text
              style={styles.label}
            >
              Descripción / Observaciones
            </Text>

            <Text
              style={
                styles.optional
              }
            >
              Opcional
            </Text>
          </View>

          <TextInput
            style={[
              styles.normalInput,
              styles.textArea,
            ]}
            placeholder="Agrega detalles sobre el gasto..."
            placeholderTextColor="#9CA3AF"
            value={descripcion}
            onChangeText={
              setDescripcion
            }
            multiline
            numberOfLines={4}
          />

          {/* COMPROBANTE */}

          <Text style={styles.label}>
            Comprobante
          </Text>

          <TouchableOpacity
            style={styles.upload}
            onPress={
              seleccionarArchivo
            }
          >
            <View
              style={
                styles.uploadCircle
              }
            >
              <Text
                style={
                  styles.uploadIcon
                }
              >
                ↑
              </Text>
            </View>

            <View
              style={{ flex: 1 }}
            >
              <Text
                style={
                  styles.uploadTitle
                }
              >
                {archivo
                  ? archivo.name
                  : "Adjuntar comprobante"}
              </Text>

              <Text
                style={
                  styles.uploadText
                }
              >
                PDF, JPG o PNG
              </Text>
            </View>

            <Text
              style={
                styles.uploadArrow
              }
            >
              →
            </Text>
          </TouchableOpacity>

          {/* BOTÓN GUARDAR */}

          <TouchableOpacity
            style={
              styles.registerButton
            }
            onPress={
              guardarGasto
            }
          >
            <Text
              style={
                styles.registerIcon
              }
            >
              {editandoId
                ? "✓"
                : "+"}
            </Text>

            <Text
              style={
                styles.registerText
              }
            >
              {editandoId
                ? "Actualizar gasto"
                : "Registrar gasto"}
            </Text>
          </TouchableOpacity>

          {/* CANCELAR */}

          <TouchableOpacity
            style={
              styles.cancelButton
            }
            onPress={
              limpiarFormulario
            }
          >
            <Text
              style={
                styles.cancelText
              }
            >
              Cancelar
            </Text>
          </TouchableOpacity>

        </View>

        {/* ==================================
            LISTA DE GASTOS
        ================================== */}

        <View
          style={styles.separator}
        />

        <View
          style={
            styles.listSection
          }
        >

          <View
            style={
              styles.listHeader
            }
          >
            <View>
              <Text
                style={
                  styles.listTitle
                }
              >
                Gastos registrados
              </Text>

              <Text
                style={
                  styles.listSubtitle
                }
              >
                Administra tus registros
              </Text>
            </View>

            <View
              style={
                styles.counter
              }
            >
              <Text
                style={
                  styles.counterText
                }
              >
                {gastos.length}
              </Text>
            </View>
          </View>

          {gastos.length === 0 ? (

            <View
              style={styles.empty}
            >
              <Text
                style={
                  styles.emptyIcon
                }
              >
                📋
              </Text>

              <Text
                style={
                  styles.emptyTitle
                }
              >
                No hay gastos registrados
              </Text>

              <Text
                style={
                  styles.emptyText
                }
              >
                Los gastos que registres aparecerán aquí.
              </Text>
            </View>

          ) : (

            gastos.map((item) => (

              <View
                key={item.id}
                style={
                  styles.gastoCard
                }
              >

                <View
                  style={
                    styles.gastoTop
                  }
                >

                  <View
                    style={
                      styles.gastoIcon
                    }
                  >
                    <Text>
                      💰
                    </Text>
                  </View>

                  <View
                    style={{ flex: 1 }}
                  >
                    <Text
                      style={
                        styles.gastoCategoria
                      }
                    >
                      {item.categoria}
                    </Text>

                    <Text
                      style={
                        styles.gastoVehiculo
                      }
                    >
                      {item.vehiculo}
                    </Text>
                  </View>

                  <View
                    style={
                      styles.amountTag
                    }
                  >
                    <Text
                      style={
                        styles.amountTagText
                      }
                    >
                      ${item.monto}
                    </Text>
                  </View>

                </View>

                <View
                  style={
                    styles.gastoInfo
                  }
                >

                  <View
                    style={
                      styles.infoItem
                    }
                  >
                    <Text
                      style={
                        styles.infoLabel
                      }
                    >
                      Fecha
                    </Text>

                    <Text
                      style={
                        styles.infoValue
                      }
                    >
                      {item.fecha}
                    </Text>
                  </View>

                  {item.factura ? (
                    <View
                      style={
                        styles.infoItem
                      }
                    >
                      <Text
                        style={
                          styles.infoLabel
                        }
                      >
                        Comprobante
                      </Text>

                      <Text
                        style={
                          styles.infoValue
                        }
                      >
                        {item.factura}
                      </Text>
                    </View>
                  ) : null}

                </View>

                {item.descripcion ? (
                  <Text
                    style={
                      styles.description
                    }
                  >
                    {item.descripcion}
                  </Text>
                ) : null}

                {item.archivo ? (
                  <View
                    style={
                      styles.fileTag
                    }
                  >
                    <Text>
                      📎
                    </Text>

                    <Text
                      style={
                        styles.fileText
                      }
                    >
                      {item.archivo}
                    </Text>
                  </View>
                ) : null}

                {/* EDITAR / ELIMINAR */}

                <View
                  style={
                    styles.actions
                  }
                >

                  <TouchableOpacity
                    style={
                      styles.editButton
                    }
                    onPress={() =>
                      editarGasto(
                        item
                      )
                    }
                  >
                    <Text
                      style={
                        styles.editIcon
                      }
                    >
                      ✎
                    </Text>

                    <Text
                      style={
                        styles.editText
                      }
                    >
                      Editar
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={
                      styles.deleteButton
                    }
                    onPress={() =>
                      eliminarGasto(
                        item.id
                      )
                    }
                  >
                    <Text
                      style={
                        styles.deleteText
                      }
                    >
                      🗑 Eliminar
                    </Text>
                  </TouchableOpacity>

                </View>

              </View>

            ))

          )}

        </View>

        {/* ==================================
            FOOTER
        ================================== */}

        <View
          style={styles.footer}
        >
          <Text
            style={
              styles.footerText
            }
          >
            Control Vehicular
          </Text>

          <Text
            style={
              styles.footerCrud
            }
          >
            CRUD completo: Crear • Leer • Actualizar • Eliminar
          </Text>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

// ==================================================
// ESTILOS
// ==================================================

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#F4F7FB",
  },

  scroll: {
    paddingBottom: 40,
  },

  // HEADER

  header: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
    paddingVertical: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },

  brandContainer: {
    flexDirection: "row",
    alignItems: "center",
  },

  logo: {
    width: 45,
    height: 45,
    borderRadius: 13,
    backgroundColor: "#E8F0FE",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 11,
  },

  logoText: {
    fontSize: 22,
  },

  brand: {
    fontSize: 17,
    fontWeight: "800",
    color: "#172033",
  },

  brandSub: {
    fontSize: 12,
    color: "#8A94A6",
    marginTop: 2,
  },

  headerIcons: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },

  bell: {
    fontSize: 20,
  },

  userCircle: {
    width: 35,
    height: 35,
    borderRadius: 18,
    backgroundColor: "#2563EB",
    justifyContent: "center",
    alignItems: "center",
  },

  userText: {
    color: "#FFFFFF",
    fontWeight: "800",
  },

  // TITULO

  titleContainer: {
    paddingHorizontal: 20,
    paddingTop: 25,
    paddingBottom: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  title: {
    fontSize: 27,
    fontWeight: "800",
    color: "#172033",
  },

  subtitle: {
    fontSize: 13,
    color: "#7B8494",
    marginTop: 5,
  },

  cancelTop: {
    color: "#2563EB",
    fontWeight: "700",
    fontSize: 12,
  },

  // FORMULARIO

  form: {
    marginHorizontal: 20,
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 18,

    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: {
      width: 0,
      height: 4,
    },

    elevation: 3,
  },

  label: {
    fontSize: 13,
    fontWeight: "700",
    color: "#303A4B",
    marginBottom: 8,
    marginTop: 13,
  },

  required: {
    color: "#EF4444",
  },

  optional: {
    fontSize: 11,
    color: "#9CA3AF",
    marginBottom: 8,
    marginTop: 13,
  },

  labelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  // SELECTS

  selectBox: {
    height: 52,
    borderWidth: 1,
    borderColor: "#DCE2EA",
    borderRadius: 11,
    paddingHorizontal: 15,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",

    backgroundColor: "#FFFFFF",
  },

  selectText: {
    color: "#172033",
    fontSize: 14,
  },

  placeholder: {
    color: "#9CA3AF",
    fontSize: 14,
  },

  arrow: {
    fontSize: 12,
    color: "#687386",
  },

  dropdown: {
    borderWidth: 1,
    borderColor: "#DCE2EA",
    borderRadius: 11,
    marginTop: 5,
    backgroundColor: "#FFFFFF",
    overflow: "hidden",
  },

  dropdownItem: {
    paddingVertical: 13,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F2F5",
  },

  dropdownText: {
    color: "#303A4B",
    fontSize: 14,
  },

  // MONTO

  amountBox: {
    height: 52,
    borderWidth: 1,
    borderColor: "#DCE2EA",
    borderRadius: 11,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
  },

  currency: {
    fontSize: 17,
    fontWeight: "700",
    color: "#687386",
    marginRight: 8,
  },

  amountInput: {
    flex: 1,
    fontSize: 15,
    color: "#172033",
  },

  // CALENDARIO

  calendarIcon: {
    fontSize: 19,
  },

  calendario: {
    marginTop: 8,
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#DCE2EA",
    padding: 15,
  },

  calendarioHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 15,
  },

  mesTitulo: {
    fontSize: 16,
    fontWeight: "800",
    color: "#172033",
  },

  mesButton: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: "#E8F0FE",
    justifyContent: "center",
    alignItems: "center",
  },

  mesButtonText: {
    color: "#2563EB",
    fontSize: 27,
    lineHeight: 30,
    fontWeight: "600",
  },

  diasSemana: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 8,
  },

  diaSemana: {
    width: "14.28%",
    textAlign: "center",
    fontSize: 11,
    fontWeight: "800",
    color: "#8A94A6",
  },

  diasGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },

  diaButton: {
    width: "14.28%",
    height: 42,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },

  diaVacio: {
    width: "14.28%",
    height: 42,
  },

  diaTexto: {
    fontSize: 13,
    color: "#303A4B",
  },

  diaSeleccionado: {
    backgroundColor: "#2563EB",
  },

  diaTextoSeleccionado: {
    color: "#FFFFFF",
    fontWeight: "800",
  },

  cerrarCalendario: {
    marginTop: 12,
    height: 40,
    borderRadius: 9,
    backgroundColor: "#F3F6FA",
    justifyContent: "center",
    alignItems: "center",
  },

  cerrarCalendarioTexto: {
    color: "#687386",
    fontWeight: "700",
    fontSize: 12,
  },

  // INPUTS

  normalInput: {
    height: 52,
    borderWidth: 1,
    borderColor: "#DCE2EA",
    borderRadius: 11,
    paddingHorizontal: 15,
    color: "#172033",
    fontSize: 14,
    backgroundColor: "#FFFFFF",
  },

  textArea: {
    height: 105,
    paddingTop: 14,
    textAlignVertical: "top",
  },

  // COMPROBANTE

  upload: {
    minHeight: 75,
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: "#B8C4D5",
    borderRadius: 12,
    paddingHorizontal: 14,

    flexDirection: "row",
    alignItems: "center",

    backgroundColor: "#F9FBFD",
  },

  uploadCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#E8F0FE",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  uploadIcon: {
    color: "#2563EB",
    fontSize: 22,
    fontWeight: "800",
  },

  uploadTitle: {
    color: "#303A4B",
    fontWeight: "700",
    fontSize: 13,
  },

  uploadText: {
    color: "#9CA3AF",
    fontSize: 11,
    marginTop: 3,
  },

  uploadArrow: {
    fontSize: 21,
    color: "#2563EB",
  },

  // BOTONES

  registerButton: {
    marginTop: 22,
    height: 53,
    backgroundColor: "#2563EB",
    borderRadius: 11,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },

  registerIcon: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "800",
    marginRight: 8,
  },

  registerText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "800",
  },

  cancelButton: {
    height: 48,
    justifyContent: "center",
    alignItems: "center",
  },

  cancelText: {
    color: "#687386",
    fontSize: 14,
    fontWeight: "700",
  },

  // LISTA

  separator: {
    height: 1,
    backgroundColor: "#E1E6ED",
    marginVertical: 25,
    marginHorizontal: 20,
  },

  listSection: {
    marginHorizontal: 20,
  },

  listHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 15,
  },

  listTitle: {
    fontSize: 21,
    fontWeight: "800",
    color: "#172033",
  },

  listSubtitle: {
    color: "#8993A4",
    fontSize: 12,
    marginTop: 3,
  },

  counter: {
    minWidth: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#E8F0FE",
    alignItems: "center",
    justifyContent: "center",
  },

  counterText: {
    color: "#2563EB",
    fontWeight: "800",
  },

  // SIN GASTOS

  empty: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 30,
    alignItems: "center",
  },

  emptyIcon: {
    fontSize: 34,
  },

  emptyTitle: {
    color: "#303A4B",
    fontWeight: "800",
    fontSize: 15,
    marginTop: 10,
  },

  emptyText: {
    color: "#9CA3AF",
    textAlign: "center",
    marginTop: 5,
    fontSize: 12,
  },

  // TARJETA

  gastoCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 13,
  },

  gastoTop: {
    flexDirection: "row",
    alignItems: "center",
  },

  gastoIcon: {
    width: 43,
    height: 43,
    borderRadius: 12,
    backgroundColor: "#EEF5FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 11,
  },

  gastoCategoria: {
    fontSize: 15,
    fontWeight: "800",
    color: "#303A4B",
  },

  gastoVehiculo: {
    fontSize: 12,
    color: "#8B95A5",
    marginTop: 3,
  },

  amountTag: {
    backgroundColor: "#EAF7EE",
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 9,
  },

  amountTagText: {
    color: "#15803D",
    fontWeight: "800",
  },

  gastoInfo: {
    flexDirection: "row",
    marginTop: 14,
    gap: 25,
  },

  infoItem: {
    flex: 1,
  },

  infoLabel: {
    fontSize: 10,
    color: "#9CA3AF",
    textTransform: "uppercase",
    fontWeight: "700",
  },

  infoValue: {
    fontSize: 12,
    color: "#303A4B",
    marginTop: 3,
  },

  description: {
    color: "#667085",
    fontSize: 12,
    lineHeight: 18,
    marginTop: 12,
  },

  fileTag: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F7FA",
    padding: 8,
    borderRadius: 8,
    marginTop: 10,
  },

  fileText: {
    color: "#667085",
    fontSize: 11,
    marginLeft: 6,
    flex: 1,
  },

  actions: {
    flexDirection: "row",
    marginTop: 14,
    gap: 9,
  },

  editButton: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: "#BFDBFE",
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    backgroundColor: "#F8FBFF",
  },

  editIcon: {
    color: "#2563EB",
    fontSize: 17,
    marginRight: 6,
  },

  editText: {
    color: "#2563EB",
    fontWeight: "700",
    fontSize: 12,
  },

  deleteButton: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: "#FECACA",
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFF9F9",
  },

  deleteText: {
    color: "#DC2626",
    fontWeight: "700",
    fontSize: 12,
  },

  // FOOTER

  footer: {
    alignItems: "center",
    marginTop: 30,
    paddingHorizontal: 20,
  },

  footerText: {
    color: "#687386",
    fontWeight: "800",
  },

  footerCrud: {
    color: "#A0A8B5",
    fontSize: 11,
    marginTop: 5,
    textAlign: "center",
  },

});
import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search, CreditCard } from 'lucide-react';
import { DetallePagoResponseDto, DetallePagoInsertDto, DetallePagoUpdateDto, EstadoPagoEnum, MetodoPagoEnum } from '../../interfaces/detallePago';
import { 
  obtenerTodosLosDetallesPago, 
  crearDetallePago, 
  actualizarDetallePago, 
  eliminarDetallePago 
} from '../../api/detallePago';

const PagosManagementPage: React.FC = () => {
  const [pagos, setPagos] = useState<DetallePagoResponseDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingPago, setEditingPago] = useState<DetallePagoResponseDto | null>(null);
  const [formData, setFormData] = useState<DetallePagoInsertDto>({
    idCita: 0,
    monto: 0,
    metodoPago: MetodoPagoEnum.EFECTIVO,
    estadoPago: EstadoPagoEnum.PENDIENTE
  });

  useEffect(() => {
    cargarPagos();
  }, []);

  const cargarPagos = async () => {
    try {
      setLoading(true);
      const data = await obtenerTodosLosDetallesPago();
      setPagos(data);
      setError(null);
    } catch (err) {
      setError('Error al cargar los pagos');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const getEstadoColor = (estado: EstadoPagoEnum) => {
    const colors = {
      [EstadoPagoEnum.PENDIENTE]: 'bg-yellow-100 text-yellow-800',
      [EstadoPagoEnum.PAGADO]: 'bg-green-100 text-green-800',
      [EstadoPagoEnum.RECHAZADO]: 'bg-red-100 text-red-800',
      [EstadoPagoEnum.REEMBOLSADO]: 'bg-blue-100 text-blue-800',
      [EstadoPagoEnum.CANCELADO]: 'bg-gray-100 text-gray-800'
    };
    return colors[estado] || 'bg-gray-100 text-gray-800';
  };

  const getMetodoColor = (metodo: MetodoPagoEnum) => {
    const colors = {
      [MetodoPagoEnum.EFECTIVO]: 'bg-green-100 text-green-800',
      [MetodoPagoEnum.TRANSFERENCIA]: 'bg-blue-100 text-blue-800',
      [MetodoPagoEnum.YAPE]: 'bg-purple-100 text-purple-800',
      [MetodoPagoEnum.PLIN]: 'bg-indigo-100 text-indigo-800',
      [MetodoPagoEnum.TARJETA]: 'bg-orange-100 text-orange-800'
    };
    return colors[metodo] || 'bg-gray-100 text-gray-800';
  };

  const formatearMonto = (monto: number) => {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN'
    }).format(monto);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingPago) {
        const updateData: DetallePagoUpdateDto = {
          monto: formData.monto,
          metodoPago: formData.metodoPago,
          estadoPago: formData.estadoPago
        };
        await actualizarDetallePago(editingPago.idDetallePago, updateData);
      } else {
        await crearDetallePago(formData);
      }
      
      await cargarPagos();
      setShowModal(false);
      resetForm();
    } catch (err) {
      setError('Error al guardar el pago');
      console.error('Error:', err);
    }
  };

  const handleEdit = (pago: DetallePagoResponseDto) => {
    setEditingPago(pago);
    setFormData({
      idCita: pago.idCita,
      monto: pago.monto,
      metodoPago: pago.metodoPago,
      estadoPago: pago.estadoPago
    });
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este pago?')) {
      try {
        await eliminarDetallePago(id);
        await cargarPagos();
      } catch (err) {
        setError('Error al eliminar el pago');
        console.error('Error:', err);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      idCita: 0,
      monto: 0,
      metodoPago: MetodoPagoEnum.EFECTIVO,
      estadoPago: EstadoPagoEnum.PENDIENTE
    });
    setEditingPago(null);
  };

  const filteredPagos = pagos.filter(pago =>
    pago.idCita.toString().includes(searchTerm) ||
    pago.metodoPago.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pago.estadoPago.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pago.monto.toString().includes(searchTerm)
  );

  if (loading) {
    return <div className="flex justify-center items-center h-64">Cargando pagos...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Gestión de Pagos</h1>
        <button
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <Plus size={20} />
          Nuevo Pago
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Barra de búsqueda */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Buscar por cita, método, estado o monto..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Tabla de pagos */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cita
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Monto
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Método de Pago
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sticky right-0 bg-gray-50">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPagos.map((pago) => (
                <tr key={pago.idDetallePago} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {pago.idDetallePago}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    Cita #{pago.idCita}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                    {formatearMonto(pago.monto)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getMetodoColor(pago.metodoPago)}`}>
                      {pago.metodoPago}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getEstadoColor(pago.estadoPago)}`}>
                      {pago.estadoPago}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2 sticky right-0 bg-white">
                    <button
                      onClick={() => handleEdit(pago)}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(pago.idDetallePago)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}

              {filteredPagos.length === 0 && (
                <tbody>
                  <tr>
                    <td colSpan={6} className="text-center py-8 text-gray-500">
                      No se encontraron pagos
                    </td>
                  </tr>
                </tbody>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal para crear/editar pago */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                <CreditCard size={20} />
                {editingPago ? 'Editar Pago' : 'Nuevo Pago'}
              </h3>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">ID Cita *</label>
                  <input
                    type="number"
                    required
                    value={formData.idCita}
                    onChange={(e) => setFormData({...formData, idCita: parseInt(e.target.value) || 0})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={!!editingPago} // No permitir cambiar cita al editar
                    placeholder="Ingrese el ID de la cita"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Monto *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formData.monto}
                    onChange={(e) => setFormData({...formData, monto: parseFloat(e.target.value) || 0})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Método de Pago *</label>
                  <select
                    required
                    value={formData.metodoPago}
                    onChange={(e) => setFormData({...formData, metodoPago: e.target.value as MetodoPagoEnum})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {Object.values(MetodoPagoEnum).map((metodo) => (
                      <option key={metodo} value={metodo}>
                        {metodo}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Estado de Pago *</label>
                  <select
                    required
                    value={formData.estadoPago}
                    onChange={(e) => setFormData({...formData, estadoPago: e.target.value as EstadoPagoEnum})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {Object.values(EstadoPagoEnum).map((estado) => (
                      <option key={estado} value={estado}>
                        {estado}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      resetForm();
                    }}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
                  >
                    {editingPago ? 'Actualizar' : 'Crear'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PagosManagementPage;

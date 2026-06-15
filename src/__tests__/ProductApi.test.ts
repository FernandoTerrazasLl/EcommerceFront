import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ProductApi } from '../entities/product/api';
import { supabase } from '../shared/api/supabase';

vi.mock('../shared/api/supabase', () => {
  const mockOrder = vi.fn();
  const mockIlike = vi.fn();
  const mockSelect = vi.fn();
  const mockFrom = vi.fn();

  mockFrom.mockReturnValue({ select: mockSelect });
  mockSelect.mockReturnValue({ ilike: mockIlike, order: mockOrder });
  mockIlike.mockReturnValue({ order: mockOrder });

  return {
    supabase: {
      from: mockFrom
    }
  };
});

describe('ProductApi Unit Tests', () => {
  const mockProducts = [
    { id: 1, name: 'Camiseta de Algodón', description: 'Cómoda', price: 20, image: 'camiseta.jpg' },
    { id: 2, name: 'Pantalón Jean', description: 'Azul', price: 40, image: 'jean.jpg' }
  ];

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('getAllProducts_returnListOfProducts', async () => {
    // HU-01 - Criterio 1: Dado que el cliente entra a la página principal de la web, 
    // cuando el sistema carga los productos, entonces debe mostrar una lista de 
    // artículos con una imagen, nombre y precio actual.

    const mockOrder = vi.fn().mockResolvedValue({ data: mockProducts, error: null });
    const mockSelect = vi.fn().mockReturnValue({ order: mockOrder });
    const mockFrom = vi.fn().mockReturnValue({ select: mockSelect });
    
    supabase.from = mockFrom;

    const results = await ProductApi.getAllProducts();
    
    expect(mockFrom).toHaveBeenCalledWith('products');
    expect(mockSelect).toHaveBeenCalledWith('*');
    expect(mockOrder).toHaveBeenCalledWith('id', { ascending: true });
    expect(results).toEqual(mockProducts);
  });
  it('searchProducts_findAnExistingProduct_returnProduct', async () => {
    // HU-02 - Criterio 1: Búsqueda válida con coincidencias
    // Dado que el cliente ingresa un término de búsqueda en la barra de búsqueda,
    // cuando hay productos cuyo nombre coincide con el término,
    // entonces el sistema debe retornar los productos coincidentes.

    const mockOrder = vi.fn().mockResolvedValue({ data: [mockProducts[0]], error: null });
    const mockIlike = vi.fn().mockReturnValue({ order: mockOrder });
    const mockSelect = vi.fn().mockReturnValue({ ilike: mockIlike });
    const mockFrom = vi.fn().mockReturnValue({ select: mockSelect });

    supabase.from = mockFrom;

    const results = await ProductApi.searchProducts('Camiseta');

    expect(mockFrom).toHaveBeenCalledWith('products');
    expect(mockSelect).toHaveBeenCalledWith('*');
    expect(mockIlike).toHaveBeenCalledWith('name', '%Camiseta%');
    expect(mockOrder).toHaveBeenCalledWith('id', { ascending: true });
    expect(results).toEqual([mockProducts[0]]);
  });
  it('searchProducts_productDoesntExist_returnEmptyProductList', async () => {
    // HU-02 - Criterio 2: 
    // (CASO INVÁLIDO) DADO que el cliente realiza una búsqueda con un término que no corresponde a ningún 
    // producto del catálogo, CUANDO el sistema finaliza el proceso de filtrado sin hallar coincidencias, 
    // ENTONCES debe mostrar en pantalla el mensaje textual "No se encontraron productos".

    const mockOrder = vi.fn().mockResolvedValue({ data: [], error: null });
    const mockIlike = vi.fn().mockReturnValue({ order: mockOrder });
    const mockSelect = vi.fn().mockReturnValue({ ilike: mockIlike });
    const mockFrom = vi.fn().mockReturnValue({ select: mockSelect });

    supabase.from = mockFrom;

    const results = await ProductApi.searchProducts('NameThatDoesNotExist');

    expect(mockFrom).toHaveBeenCalledWith('products');
    expect(mockSelect).toHaveBeenCalledWith('*');
    expect(mockIlike).toHaveBeenCalledWith('name', '%NameThatDoesNotExist%');
    expect(mockOrder).toHaveBeenCalledWith('id', { ascending: true });
    expect(results).toEqual([]);
  });
});

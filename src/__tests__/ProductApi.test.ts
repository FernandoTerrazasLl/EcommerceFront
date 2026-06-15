import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ProductApi } from '../entities/product/api';
import { supabase } from '../shared/api/supabase';
import { Product } from '../entities/product/model';

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


  it('getAllProducts_callFunctionCorrectly_returnListOfProducts', async () => {//primer HU
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

  it('getAllProducts_dataIsNull_returnEmptyArray', async () => {
    // HU-01 - Criterio 2: (CASO INVÁLIDO) Dado que el sistema falla al cargar la base de datos, 
    // cuando el cliente ingresa a la página principal, entonces el sistema no debe mostrar ningun producto.

    const mockOrder = vi.fn().mockResolvedValue({ data: null, error: null });
    const mockSelect = vi.fn().mockReturnValue({ order: mockOrder });
    const mockFrom = vi.fn().mockReturnValue({ select: mockSelect });

    supabase.from = mockFrom;

    const results = await ProductApi.getAllProducts();

    expect(mockFrom).toHaveBeenCalledWith('products');
    expect(mockSelect).toHaveBeenCalledWith('*');
    expect(mockOrder).toHaveBeenCalledWith('id', { ascending: true });
    expect(results).toEqual([]);
  });

  it('getAllProducts_callFunctionWithError_throwError', async () => {
    // HU-01 - Criterio 2: (CASO INVÁLIDO) Dado que el sistema falla al cargar la base de datos, 
    // cuando el cliente ingresa a la página principal, entonces el sistema no debe mostrar ningun producto.

    const mockOrder = vi.fn().mockResolvedValue({ data: null, error: { message: 'Database error' } });
    const mockSelect = vi.fn().mockReturnValue({ order: mockOrder });
    const mockFrom = vi.fn().mockReturnValue({ select: mockSelect });
    
    supabase.from = mockFrom;
    
    await expect(ProductApi.getAllProducts()).rejects.toThrow('Database error');
    expect(mockFrom).toHaveBeenCalledWith('products');
    expect(mockSelect).toHaveBeenCalledWith('*');
    expect(mockOrder).toHaveBeenCalledWith('id', { ascending: true });
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

  it('searchProducts_emptyNameProduct_returnEmptyProductList', async () => {
    // HU-02 - Criterio 2: 
    // (CASO INVÁLIDO) DADO que el cliente realiza una búsqueda con un término que no corresponde a ningún 
    // producto del catálogo, CUANDO el sistema finaliza el proceso de filtrado sin hallar coincidencias, 
    // ENTONCES debe mostrar en pantalla el mensaje textual "No se encontraron productos".

    const mockOrder = vi.fn().mockResolvedValue({ data: mockProducts, error: null });
    const mockSelect = vi.fn().mockReturnValue({ order: mockOrder });
    const mockFrom = vi.fn().mockReturnValue({ select: mockSelect });
    
    supabase.from = mockFrom;
    
    const results = await ProductApi.searchProducts('');
    
    expect(mockFrom).toHaveBeenCalledWith('products');
    expect(mockSelect).toHaveBeenCalledWith('*');
    expect(mockOrder).toHaveBeenCalledWith('id', { ascending: true });
    expect(results).toEqual(mockProducts);
  });

    it('searchProducts_callFunctionWithError_throwError', async () => {
    // HU-02 - Criterio 2: 
    // (CASO INVÁLIDO) DADO que el cliente realiza una búsqueda con un término que no corresponde a ningún 
    // producto del catálogo, CUANDO el sistema finaliza el proceso de filtrado sin hallar coincidencias, 
    // ENTONCES debe mostrar en pantalla el mensaje textual "No se encontraron productos".

    const mockOrder = vi.fn().mockResolvedValue({ data: null, error: { message: 'Search query error' } });
    const mockIlike = vi.fn().mockReturnValue({ order: mockOrder });
    const mockSelect = vi.fn().mockReturnValue({ ilike: mockIlike });
    const mockFrom = vi.fn().mockReturnValue({ select: mockSelect });

    supabase.from = mockFrom;

    await expect(ProductApi.searchProducts('Camiseta')).rejects.toThrow('Search query error');
    expect(mockFrom).toHaveBeenCalledWith('products');
    expect(mockSelect).toHaveBeenCalledWith('*');
    expect(mockIlike).toHaveBeenCalledWith('name', '%Camiseta%');
    expect(mockOrder).toHaveBeenCalledWith('id', { ascending: true });
  });

  it('searchProducts_dataIsNull_returnEmptyArray', async () => {
    // HU-02 - Criterio 2: 
    // (CASO INVÁLIDO) DADO que el cliente realiza una búsqueda con un término que no corresponde a ningún 
    // producto del catálogo, CUANDO el sistema finaliza el proceso de filtrado sin hallar coincidencias, 
    // ENTONCES debe mostrar en pantalla el mensaje textual "No se encontraron productos".

    const mockOrder = vi.fn().mockResolvedValue({ data: null, error: null });
    const mockIlike = vi.fn().mockReturnValue({ order: mockOrder });
    const mockSelect = vi.fn().mockReturnValue({ ilike: mockIlike });
    const mockFrom = vi.fn().mockReturnValue({ select: mockSelect });

    supabase.from = mockFrom;

    const results = await ProductApi.searchProducts('Camiseta');

    expect(mockFrom).toHaveBeenCalledWith('products');
    expect(mockSelect).toHaveBeenCalledWith('*');
    expect(mockIlike).toHaveBeenCalledWith('name', '%Camiseta%');
    expect(mockOrder).toHaveBeenCalledWith('id', { ascending: true });
    expect(results).toEqual([]);
  });
  it('getProductById_findAnExistingProduct_returnProductDetail', async () => {
    // HU-03 - Criterio 1 (CASO VÁLIDO): Dado que el cliente visualiza el listado de productos, 
    // cuando hace clic en la imagen de un artículo, entonces el sistema debe mostrar su detalle 
    // incluyendo nombre, precio, imagen y una descripción breve.

    const mockProductWithCategory: Product = {
      id: 1,
      name: 'Camiseta de Algodón',
      description: 'Cómoda',
      price: 20,
      image: 'camiseta.jpg'
    };

    const mockSingle = vi.fn().mockResolvedValue({ data: mockProductWithCategory, error: null });
    const mockEq = vi.fn().mockReturnValue({ single: mockSingle });
    const mockSelect = vi.fn().mockReturnValue({ eq: mockEq });
    const mockFrom = vi.fn().mockReturnValue({ select: mockSelect });

    supabase.from = mockFrom;

    const result = await ProductApi.getProductById(1);

    expect(mockFrom).toHaveBeenCalledWith('products');
    expect(mockSelect).toHaveBeenCalledWith('*');
    expect(mockEq).toHaveBeenCalledWith('id', 1);
    expect(mockSingle).toHaveBeenCalled();
    expect(result).toEqual(mockProductWithCategory);
  });
  it('getProductById_productIsDisabledOrNotExists_returnUndefined', async () => {
    // HU-03 - Criterio 2 (CASO INVÁLIDO): Dado que el cliente intenta ver el detalle de un producto 
    // que acaba de ser deshabilitado por el administrador, cuando hace clic en la imagen, entonces el 
    // sistema debe bloquear el acceso, mostrar un mensaje "El artículo ya no se encuentra disponible" 
    // y devolverlo al menú principal.

    const mockSingle = vi.fn().mockResolvedValue({ data: null, error: { message: 'Object not found' } });
    const mockEq = vi.fn().mockReturnValue({ single: mockSingle });
    const mockSelect = vi.fn().mockReturnValue({ eq: mockEq });
    const mockFrom = vi.fn().mockReturnValue({ select: mockSelect });

    supabase.from = mockFrom;

    const result = await ProductApi.getProductById(999);

    expect(mockFrom).toHaveBeenCalledWith('products');
    expect(mockSelect).toHaveBeenCalledWith('*');
    expect(mockEq).toHaveBeenCalledWith('id', 999);
    expect(mockSingle).toHaveBeenCalled();
    expect(result).toBeUndefined();
  });
});


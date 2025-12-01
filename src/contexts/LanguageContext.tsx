import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  JSX,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type Language = "en" | "es";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => Promise<void>;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const LANGUAGE_STORAGE_KEY = "@inventory_app_language";

// Translations
const translations: Record<Language, Record<string, string>> = {
  en: {
    // Navigation
    "nav.dashboard": "Dashboard",
    "nav.inventory": "Inventory",
    "nav.analytics": "Analytics",
    "nav.profile": "Profile",
    
    // Profile Screen
    "profile.accountSettings": "Account Settings",
    "profile.accountSettingsDesc": "Manage your account preferences",
    "profile.darkMode": "Dark Mode",
    "profile.darkModeDesc": "Enable dark theme",
    "profile.language": "Language",
    "profile.languageDesc": "Change app language",
    "profile.notifications": "Notifications",
    "profile.notificationsDesc": "Configure notification settings",
    "profile.helpSupport": "Help & Support",
    "profile.helpSupportDesc": "Get help and contact support",
    "profile.about": "About",
    "profile.aboutDesc": "App version and information",
    "profile.logout": "Logout",
    "profile.logoutConfirm": "Are you sure you want to logout?",
    "profile.cancel": "Cancel",
    "profile.spanish": "Spanish",
    "profile.english": "English",
    
    // Inventory
    "inventory.title": "Inventory",
    "inventory.itemDetails": "Item Details",
    "inventory.addItem": "Add Item",
    "inventory.editItem": "Edit Item",
    
    // Dashboard
    "dashboard.recentItems": "Recent Items",
    "dashboard.totalItems": "Total Items",
    "dashboard.totalUnits": "Total Units",
    "dashboard.totalValue": "Total Value",
    "dashboard.lowStock": "Low Stock",
    "dashboard.outOfStock": "Out of Stock",
    "dashboard.items": "items",
    "dashboard.units": "units",
    "dashboard.inventoryWorth": "Inventory worth",
    "dashboard.itemsNeedRestock": "Items need restock",
    "dashboard.urgentAttention": "Urgent attention",
    
    // Common
    "common.units": "units",
    "common.save": "Save",
    "common.cancel": "Cancel",
    "common.delete": "Delete",
    "common.edit": "Edit",
    "common.add": "Add",
    "common.back": "Back",
    "common.all": "All",
    "common.items": "items",
    
    // Inventory List
    "inventory.search": "Search inventory...",
    "inventory.sort": "Sort",
    "inventory.sortByName": "Name",
    "inventory.sortByQuantity": "Quantity",
    "inventory.sortByPrice": "Price",
    "inventory.noCategories": "No categories available",
    "inventory.noSuppliers": "No suppliers available",
    
    // Item Details
    "itemDetails.itemDetails": "Item Details",
    "itemDetails.category": "Category",
    "itemDetails.currentStock": "Current Stock",
    "itemDetails.minimumStock": "Minimum Stock",
    "itemDetails.unitPrice": "Unit Price",
    "itemDetails.totalValue": "Total Value",
    "itemDetails.supplier": "Supplier",
    "itemDetails.lastUpdated": "Last Updated",
    "itemDetails.editItem": "Edit Item",
    "itemDetails.deleteItem": "Delete Item",
    "itemDetails.deleteConfirm": "Are you sure you want to delete this item?",
    "itemDetails.deleteFailed": "Failed to delete the item. Please try again.",
    "itemDetails.inStock": "In Stock",
    "itemDetails.lowStock": "Low Stock",
    "itemDetails.outOfStock": "Out of Stock",
    
    // Add/Edit Item
    "addEdit.itemName": "Item Name *",
    "addEdit.category": "Category *",
    "addEdit.categoryAvailable": "available",
    "addEdit.currentQuantity": "Current Quantity",
    "addEdit.minimumStock": "Minimum Stock",
    "addEdit.unitPrice": "Unit Price",
    "addEdit.supplier": "Supplier *",
    "addEdit.supplierAvailable": "available",
    "addEdit.description": "Description",
    "addEdit.updateItem": "Update Item",
    "addEdit.addItem": "Add Item",
    "addEdit.validationError": "Validation Error",
    "addEdit.itemNameRequired": "Item name is required",
    "addEdit.categoryRequired": "Category is required",
    "addEdit.validCategory": "Please select a valid category",
    "addEdit.supplierRequired": "Supplier is required",
    "addEdit.validSupplier": "Please select a valid supplier",
    "addEdit.unitPriceRequired": "Unit price is required",
    "addEdit.unitPriceValid": "Unit price must be a valid positive number",
    "addEdit.quantityNegative": "Current quantity cannot be negative",
    "addEdit.minStockNegative": "Minimum stock level cannot be negative",
    "addEdit.saveFailed": "Failed to save item. Please try again.",
    
    // Analytics
    "analytics.title": "Analytics",
    "analytics.subtitle": "Comprehensive inventory insights",
    "analytics.timePeriod": "Time Period",
    "analytics.category": "Category",
    "analytics.noData": "No Data Available",
    "analytics.noDataDesc": "Add some inventory items to see analytics",
    "analytics.totalPortfolioValue": "Total Portfolio Value",
    "analytics.uniqueItems": "unique items",
    "analytics.totalUnits": "Total Units",
    "analytics.avg": "Avg",
    "analytics.stockHealth": "Stock Health",
    "analytics.itemsHealthy": "items healthy",
    "analytics.attentionNeeded": "Attention Needed",
    "analytics.critical": "critical",
    "analytics.categoryPerformance": "Category Performance",
    "analytics.supplierDistribution": "Supplier Distribution",
    "analytics.stockStatusDistribution": "Stock Status Distribution",
    "analytics.priceAnalysis": "Price Analysis",
    "analytics.highestPricedItem": "Highest Priced Item",
    "analytics.averageUnitPrice": "Average Unit Price",
    "analytics.lowestPricedItem": "Lowest Priced Item",
    "analytics.acrossAllItems": "Across all items",
    "analytics.percentOfInventory": "% of inventory",
    "analytics.percentNeedsReorder": "% needs reorder",
    "analytics.percentCritical": "% critical",
  },
  es: {
    // Navigation
    "nav.dashboard": "Panel",
    "nav.inventory": "Inventario",
    "nav.analytics": "Análisis",
    "nav.profile": "Perfil",
    
    // Profile Screen
    "profile.accountSettings": "Configuración de Cuenta",
    "profile.accountSettingsDesc": "Administra las preferencias de tu cuenta",
    "profile.darkMode": "Modo Oscuro",
    "profile.darkModeDesc": "Activar tema oscuro",
    "profile.language": "Idioma",
    "profile.languageDesc": "Cambiar idioma de la aplicación",
    "profile.notifications": "Notificaciones",
    "profile.notificationsDesc": "Configurar notificaciones",
    "profile.helpSupport": "Ayuda y Soporte",
    "profile.helpSupportDesc": "Obtener ayuda y contactar soporte",
    "profile.about": "Acerca de",
    "profile.aboutDesc": "Versión e información de la aplicación",
    "profile.logout": "Cerrar Sesión",
    "profile.logoutConfirm": "¿Estás seguro de que quieres cerrar sesión?",
    "profile.cancel": "Cancelar",
    "profile.spanish": "Español",
    "profile.english": "Inglés",
    
    // Inventory
    "inventory.title": "Inventario",
    "inventory.itemDetails": "Detalles del Artículo",
    "inventory.addItem": "Agregar Artículo",
    "inventory.editItem": "Editar Artículo",
    
    // Dashboard
    "dashboard.recentItems": "Artículos Recientes",
    "dashboard.totalItems": "Total de Artículos",
    "dashboard.totalUnits": "Total de Unidades",
    "dashboard.totalValue": "Valor Total",
    "dashboard.lowStock": "Stock Bajo",
    "dashboard.outOfStock": "Sin Stock",
    "dashboard.items": "artículos",
    "dashboard.units": "unidades",
    "dashboard.inventoryWorth": "Valor del inventario",
    "dashboard.itemsNeedRestock": "Artículos necesitan reposición",
    "dashboard.urgentAttention": "Atención urgente",
    
    // Common
    "common.units": "unidades",
    "common.save": "Guardar",
    "common.cancel": "Cancelar",
    "common.delete": "Eliminar",
    "common.edit": "Editar",
    "common.add": "Agregar",
    "common.back": "Atrás",
    "common.all": "Todos",
    "common.items": "artículos",
    
    // Inventory List
    "inventory.search": "Buscar en inventario...",
    "inventory.sort": "Ordenar",
    "inventory.sortByName": "Nombre",
    "inventory.sortByQuantity": "Cantidad",
    "inventory.sortByPrice": "Precio",
    "inventory.noCategories": "No hay categorías disponibles",
    "inventory.noSuppliers": "No hay proveedores disponibles",
    
    // Item Details
    "itemDetails.itemDetails": "Detalles del Artículo",
    "itemDetails.category": "Categoría",
    "itemDetails.currentStock": "Stock Actual",
    "itemDetails.minimumStock": "Stock Mínimo",
    "itemDetails.unitPrice": "Precio Unitario",
    "itemDetails.totalValue": "Valor Total",
    "itemDetails.supplier": "Proveedor",
    "itemDetails.lastUpdated": "Última Actualización",
    "itemDetails.editItem": "Editar Artículo",
    "itemDetails.deleteItem": "Eliminar Artículo",
    "itemDetails.deleteConfirm": "¿Estás seguro de que quieres eliminar este artículo?",
    "itemDetails.deleteFailed": "Error al eliminar el artículo. Por favor intenta de nuevo.",
    "itemDetails.inStock": "En Stock",
    "itemDetails.lowStock": "Stock Bajo",
    "itemDetails.outOfStock": "Sin Stock",
    
    // Add/Edit Item
    "addEdit.itemName": "Nombre del Artículo *",
    "addEdit.category": "Categoría *",
    "addEdit.categoryAvailable": "disponibles",
    "addEdit.currentQuantity": "Cantidad Actual",
    "addEdit.minimumStock": "Stock Mínimo",
    "addEdit.unitPrice": "Precio Unitario",
    "addEdit.supplier": "Proveedor *",
    "addEdit.supplierAvailable": "disponibles",
    "addEdit.description": "Descripción",
    "addEdit.updateItem": "Actualizar Artículo",
    "addEdit.addItem": "Agregar Artículo",
    "addEdit.validationError": "Error de Validación",
    "addEdit.itemNameRequired": "El nombre del artículo es requerido",
    "addEdit.categoryRequired": "La categoría es requerida",
    "addEdit.validCategory": "Por favor selecciona una categoría válida",
    "addEdit.supplierRequired": "El proveedor es requerido",
    "addEdit.validSupplier": "Por favor selecciona un proveedor válido",
    "addEdit.unitPriceRequired": "El precio unitario es requerido",
    "addEdit.unitPriceValid": "El precio unitario debe ser un número positivo válido",
    "addEdit.quantityNegative": "La cantidad actual no puede ser negativa",
    "addEdit.minStockNegative": "El nivel de stock mínimo no puede ser negativa",
    "addEdit.saveFailed": "Error al guardar el artículo. Por favor intenta de nuevo.",
    
    // Analytics
    "analytics.title": "Análisis",
    "analytics.subtitle": "Análisis completo del inventario",
    "analytics.timePeriod": "Período de Tiempo",
    "analytics.category": "Categoría",
    "analytics.noData": "No Hay Datos Disponibles",
    "analytics.noDataDesc": "Agrega algunos artículos al inventario para ver análisis",
    "analytics.totalPortfolioValue": "Valor Total del Portafolio",
    "analytics.uniqueItems": "artículos únicos",
    "analytics.totalUnits": "Total de Unidades",
    "analytics.avg": "Prom",
    "analytics.stockHealth": "Salud del Stock",
    "analytics.itemsHealthy": "artículos saludables",
    "analytics.attentionNeeded": "Atención Necesaria",
    "analytics.critical": "críticos",
    "analytics.categoryPerformance": "Rendimiento por Categoría",
    "analytics.supplierDistribution": "Distribución de Proveedores",
    "analytics.stockStatusDistribution": "Distribución del Estado del Stock",
    "analytics.priceAnalysis": "Análisis de Precios",
    "analytics.highestPricedItem": "Artículo de Mayor Precio",
    "analytics.averageUnitPrice": "Precio Unitario Promedio",
    "analytics.lowestPricedItem": "Artículo de Menor Precio",
    "analytics.acrossAllItems": "En todos los artículos",
    "analytics.percentOfInventory": "% del inventario",
    "analytics.percentNeedsReorder": "% necesita reorden",
    "analytics.percentCritical": "% crítico",
  },
};

export const LanguageProvider = ({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element => {
  const [language, setLanguageState] = useState<Language>("es");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadLanguagePreference();
  }, []);

  const loadLanguagePreference = async () => {
    try {
      const savedLanguage = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
      if (savedLanguage === "en" || savedLanguage === "es") {
        setLanguageState(savedLanguage);
      }
    } catch (error) {
      console.log("Error loading language preference:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveLanguagePreference = async (lang: Language) => {
    try {
      await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
    } catch (error) {
      console.log("Error saving language preference:", error);
    }
  };

  const setLanguage = async (lang: Language) => {
    setLanguageState(lang);
    await saveLanguagePreference(lang);
  };

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  // Always provide the context, even while loading
  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};

export default LanguageContext;


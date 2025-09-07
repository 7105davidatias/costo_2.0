
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileTemplate, Plus, Search, Tag, Lightbulb, Zap } from 'lucide-react';

interface Template {
  id: string;
  name: string;
  category: string;
  description: string;
  itemName: string;
  specifications: Record<string, any>;
  estimatedCost?: string;
  tags: string[];
  usage: number;
}

const predefinedTemplates: Template[] = [
  {
    id: 'laptop-template',
    name: 'מחשב נייד עסקי',
    category: 'טכנולוגיה',
    description: 'תבנית למחשבים ניידים לשימוש עסקי',
    itemName: 'מחשב נייד Dell Latitude',
    specifications: {
      processor: 'Intel Core i7-13700',
      memory: '16GB DDR4',
      storage: '512GB NVMe SSD',
      graphics: 'Intel Iris Xe',
      display: '14" Full HD',
      warranty: '3 שנות אחריות',
      os: 'Windows 11 Pro'
    },
    estimatedCost: '6500',
    tags: ['מחשב', 'נייד', 'עסקי'],
    usage: 45
  },
  {
    id: 'server-template',
    name: 'שרת עסקי',
    category: 'טכנולוגיה', 
    description: 'תבנית לשרתים עסקיים',
    itemName: 'שרת Dell PowerEdge',
    specifications: {
      processor: 'Intel Xeon Silver 4314',
      memory: '64GB DDR4 ECC',
      storage: '2x 1TB NVMe SSD',
      network: '4x 1GbE + 2x 10GbE',
      powerSupply: '750W Redundant',
      rackUnit: '2U',
      warranty: '3 years'
    },
    estimatedCost: '45000',
    tags: ['שרת', 'חומרה', 'רשת'],
    usage: 28
  },
  {
    id: 'vehicle-template',
    name: 'רכב מסחרי',
    category: 'רכבים',
    description: 'תבנית לרכבים מסחריים',
    itemName: 'רכב מסחרי קל',
    specifications: {
      vehicleType: 'משאית חלוקה',
      capacity: '3.5 טון',
      fuelType: 'דיזל',
      transmission: 'אוטומטי',
      enginePower: '150 כ"ס',
      cargoVolume: '15 מ"ק',
      warranty: '5 שנות אחריות'
    },
    estimatedCost: '120000',
    tags: ['רכב', 'משאית', 'חלוקה'],
    usage: 15
  },
  {
    id: 'furniture-template',
    name: 'ריהוט משרדי',
    category: 'ריהוט',
    description: 'תבנית לריהוט משרדי ארגונומי',
    itemName: 'כסא משרדי ארגונומי',
    specifications: {
      material: 'בד נושם + מתכת',
      adjustability: 'גובה, משענת, משענות ידיים',
      warranty: '5 שנות אחריות',
      certification: 'תקן ISO 9001',
      weight: '15 ק"ג',
      dimensions: '65x65x120 ס"מ'
    },
    estimatedCost: '1800',
    tags: ['כסא', 'ארגונומי', 'משרד'],
    usage: 32
  },
  {
    id: 'security-template',
    name: 'שירותי אבטחת מידע',
    category: 'שירותים',
    description: 'תבנית לשירותי SOC ואבטחת מידע',
    itemName: 'שירותי SOC מנוהלים 24/7',
    specifications: {
      serviceType: 'SOC מנוהל',
      coverage: '24/7/365',
      responseTime: '15 דקות',
      monitoring: 'ניטור מתקדם + AI',
      reporting: 'דוחות שבועיים וחודשיים',
      compliance: 'SOX, GDPR, ISO27001'
    },
    estimatedCost: '2400000',
    tags: ['אבטחה', 'SOC', 'ניטור'],
    usage: 8
  }
];

interface TemplatesProps {
  onSelectTemplate: (template: Template) => void;
  className?: string;
}

export default function Templates({ onSelectTemplate, className }: TemplatesProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [templates] = useState<Template[]>(predefinedTemplates);

  const categories = ['all', ...Array.from(new Set(templates.map(t => t.category)))];
  
  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleUseTemplate = (template: Template) => {
    onSelectTemplate(template);
  };

  return (
    <Card className={`bg-card border-primary/20 ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center space-x-reverse space-x-2">
          <FileTemplate className="text-primary w-5 h-5" />
          <span>תבניות דרישות רכש</span>
        </CardTitle>
        <p className="text-muted-foreground text-sm">
          השתמש בתבניות מוכנות לזירוז תהליך יצירת דרישות רכש
        </p>
      </CardHeader>
      <CardContent>
        {/* חיפוש וסינון */}
        <div className="flex gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="חפש תבניות..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pr-10"
            />
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="בחר קטגוריה" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">כל הקטגוריות</SelectItem>
              {categories.filter(cat => cat !== 'all').map(category => (
                <SelectItem key={category} value={category}>{category}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* רשימת תבניות */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredTemplates.map((template) => (
            <Card key={template.id} className="border-muted/20 hover:border-primary/40 transition-colors">
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-medium text-foreground mb-1">{template.name}</h4>
                    <p className="text-sm text-muted-foreground">{template.description}</p>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {template.usage} שימושים
                  </Badge>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="text-sm">
                    <span className="text-muted-foreground">פריט:</span>
                    <span className="text-foreground mr-2">{template.itemName}</span>
                  </div>
                  {template.estimatedCost && (
                    <div className="text-sm">
                      <span className="text-muted-foreground">אומדן עלות:</span>
                      <span className="text-success font-medium mr-2">
                        ₪{parseInt(template.estimatedCost).toLocaleString()}
                      </span>
                    </div>
                  )}
                </div>

                {/* תגים */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {template.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      <Tag className="w-3 h-3 ml-1" />
                      {tag}
                    </Badge>
                  ))}
                </div>

                {/* מפרטים מקוצרים */}
                <div className="bg-muted/10 rounded p-2 mb-4">
                  <p className="text-xs text-muted-foreground mb-1">מפרטים עיקריים:</p>
                  <div className="text-xs space-y-1">
                    {Object.entries(template.specifications).slice(0, 3).map(([key, value]) => (
                      <div key={key}>
                        <span className="text-muted-foreground">{key}:</span>
                        <span className="text-foreground mr-1">{String(value)}</span>
                      </div>
                    ))}
                    {Object.keys(template.specifications).length > 3 && (
                      <div className="text-muted-foreground">
                        +{Object.keys(template.specifications).length - 3} מפרטים נוספים
                      </div>
                    )}
                  </div>
                </div>

                <Button 
                  onClick={() => handleUseTemplate(template)}
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                  size="sm"
                >
                  <Plus className="w-4 h-4 ml-2" />
                  השתמש בתבנית
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredTemplates.length === 0 && (
          <div className="text-center py-8">
            <FileTemplate className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">
              לא נמצאו תבניות
            </h3>
            <p className="text-muted-foreground">
              נסה לשנות את מונחי החיפוש או הקטגוריה
            </p>
          </div>
        )}

        {/* המלצות AI */}
        <div className="mt-6 p-4 bg-info/10 border border-info/30 rounded-lg">
          <div className="flex items-start space-x-reverse space-x-3">
            <Lightbulb className="text-info mt-1 w-5 h-5 flex-shrink-0" />
            <div>
              <h4 className="font-medium text-foreground mb-1">המלצות AI לתבניות</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• תבניות פופולריות משפרות דיוק בממוצע של 23%</li>
                <li>• המלצה: השתמש בתבנית "מחשב נייד עסקי" לבקשות טכנולוגיה</li>
                <li>• תבניות מקצרות זמן מילוי ב-65% בממוצע</li>
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

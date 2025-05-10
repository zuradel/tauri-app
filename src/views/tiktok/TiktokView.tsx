import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Download,
  Pause,
  Play,
  Plus,
  Settings,
  Trash,
  Upload,
} from 'lucide-react';

const TiktokView = () => {
  return (
    <div className='p-4 h-full flex flex-col'>
      <Tabs defaultValue='tasks' className='w-full h-full flex flex-col'>
        <TabsList className='w-full justify-start border-b px-0 rounded-none bg-transparent h-auto mb-3'>
          <TabsTrigger
            value='tasks'
            className='data-[state=active]:bg-background rounded-none data-[state=active]:border-b-2 data-[state=active]:border-blue-500 data-[state=active]:shadow-none h-10 px-4'
          >
            Tasks
          </TabsTrigger>
          <TabsTrigger
            value='accounts'
            className='data-[state=active]:bg-background rounded-none data-[state=active]:border-b-2 data-[state=active]:border-blue-500 data-[state=active]:shadow-none h-10 px-4'
          >
            Accounts
          </TabsTrigger>
          <TabsTrigger
            value='history'
            className='data-[state=active]:bg-background rounded-none data-[state=active]:border-b-2 data-[state=active]:border-blue-500 data-[state=active]:shadow-none h-10 px-4'
          >
            History
          </TabsTrigger>
          <TabsTrigger
            value='settings'
            className='data-[state=active]:bg-background rounded-none data-[state=active]:border-b-2 data-[state=active]:border-blue-500 data-[state=active]:shadow-none h-10 px-4'
          >
            Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value='tasks' className='flex-1 mt-0 overflow-auto'>
          <TasksTab />
        </TabsContent>

        <TabsContent value='accounts' className='flex-1 mt-0 overflow-auto'>
          <AccountsTab />
        </TabsContent>

        <TabsContent value='history' className='flex-1 mt-0 overflow-auto'>
          <div className='grid gap-4'>
            <Card>
              <CardHeader className='px-4 py-3'>
                <CardTitle>Activity History</CardTitle>
              </CardHeader>
              <CardContent className='px-4 pb-4'>
                <p className='mb-3'>
                  View your task execution history and results.
                </p>
                <div className='border dark:border-[#1e293b] rounded-md overflow-hidden'>
                  <Table>
                    <TableHeader>
                      <TableRow className='bg-muted/50'>
                        <TableHead className='py-2.5 px-3 font-medium'>
                          Date
                        </TableHead>
                        <TableHead className='py-2.5 px-3 font-medium'>
                          Task
                        </TableHead>
                        <TableHead className='py-2.5 px-3 font-medium'>
                          Device
                        </TableHead>
                        <TableHead className='py-2.5 px-3 font-medium'>
                          Status
                        </TableHead>
                        <TableHead className='py-2.5 px-3 font-medium'>
                          Time
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {[1, 2, 3, 4, 5].map((i) => (
                        <TableRow key={i} className='hover:bg-muted/50'>
                          <TableCell className='py-2.5 px-3'>
                            2025-05-{10 + i}
                          </TableCell>
                          <TableCell className='py-2.5 px-3'>
                            Watch videos
                          </TableCell>
                          <TableCell className='py-2.5 px-3'>
                            SM-G950F ({i})
                          </TableCell>
                          <TableCell className='py-2.5 px-3 text-green-600 dark:text-green-400'>
                            Completed
                          </TableCell>
                          <TableCell className='py-2.5 px-3'>
                            10:{i}0:25
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value='settings' className='flex-1 mt-0 overflow-auto'>
          <div className='grid gap-4'>
            <Card>
              <CardHeader className='px-4 py-3'>
                <CardTitle>TikTok Settings</CardTitle>
              </CardHeader>
              <CardContent className='px-4 pb-4'>
                <div className='space-y-4'>
                  <div className='grid grid-cols-2 gap-4'>
                    <div className='space-y-2'>
                      <label className='text-sm font-medium'>
                        Default Watch Time (seconds)
                      </label>
                      <Input defaultValue='30' />
                    </div>
                    <div className='space-y-2'>
                      <label className='text-sm font-medium'>
                        Task Timeout (minutes)
                      </label>
                      <Input defaultValue='60' />
                    </div>
                  </div>

                  <div className='space-y-2.5'>
                    <div className='flex items-center space-x-2.5'>
                      <Checkbox id='autoRetry' />
                      <label htmlFor='autoRetry' className='text-sm'>
                        Auto retry failed tasks (up to 3 attempts)
                      </label>
                    </div>

                    <div className='flex items-center space-x-2.5'>
                      <Checkbox id='rotateAccounts' />
                      <label htmlFor='rotateAccounts' className='text-sm'>
                        Rotate accounts to avoid detection
                      </label>
                    </div>

                    <div className='flex items-center space-x-2.5'>
                      <Checkbox id='proxy' />
                      <label htmlFor='proxy' className='text-sm'>
                        Use proxy for connections
                      </label>
                    </div>
                  </div>

                  <Button className='mt-2'>Save Settings</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

const TasksTab = () => {
  return (
    <div className='grid gap-4'>
      <div className='flex justify-between'>
        <div className='flex space-x-2.5'>
          <Button className='bg-green-500 hover:bg-green-600'>
            <Play className='h-4 w-4 mr-2' />
            Start All
          </Button>
          <Button variant='outline'>
            <Pause className='h-4 w-4 mr-2' />
            Pause All
          </Button>
          <Button variant='outline'>
            <Settings className='h-4 w-4 mr-2' />
            Configure
          </Button>
        </div>
        <Button className='bg-blue-500 hover:bg-blue-600'>
          <Plus className='h-4 w-4 mr-2' />
          Add Task
        </Button>
      </div>

      <Card className='overflow-hidden'>
        <CardContent className='p-0'>
          <Table>
            <TableHeader>
              <TableRow className='border-b bg-muted/50'>
                <TableHead className='py-2.5 px-3 font-medium'>
                  Task Name
                </TableHead>
                <TableHead className='py-2.5 px-3 font-medium'>Type</TableHead>
                <TableHead className='py-2.5 px-3 font-medium'>
                  Devices
                </TableHead>
                <TableHead className='py-2.5 px-3 font-medium'>
                  Progress
                </TableHead>
                <TableHead className='py-2.5 px-3 font-medium'>
                  Status
                </TableHead>
                <TableHead className='py-2.5 px-3 font-medium'>
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow className='hover:bg-muted/50'>
                <TableCell className='py-2.5 px-3'>
                  Watch TikTok Videos
                </TableCell>
                <TableCell className='py-2.5 px-3'>Watching</TableCell>
                <TableCell className='py-2.5 px-3'>5 / 10</TableCell>
                <TableCell className='py-2.5 px-3'>
                  <div className='w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5'>
                    <div
                      className='bg-blue-600 h-2.5 rounded-full'
                      style={{ width: '45%' }}
                    ></div>
                  </div>
                </TableCell>
                <TableCell className='py-2.5 px-3'>
                  <span className='px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 rounded-full text-xs font-medium'>
                    Running
                  </span>
                </TableCell>
                <TableCell className='py-2.5 px-3'>
                  <div className='flex space-x-2'>
                    <Button size='sm' variant='ghost' className='h-8 w-8 p-0'>
                      <Play className='h-4 w-4' />
                    </Button>
                    <Button size='sm' variant='ghost' className='h-8 w-8 p-0'>
                      <Settings className='h-4 w-4' />
                    </Button>
                    <Button
                      size='sm'
                      variant='ghost'
                      className='h-8 w-8 p-0 text-red-500 dark:text-red-400'
                    >
                      <Trash className='h-4 w-4' />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>

              <TableRow className='hover:bg-muted/50'>
                <TableCell className='py-2.5 px-3'>Like and Comment</TableCell>
                <TableCell className='py-2.5 px-3'>Engagement</TableCell>
                <TableCell className='py-2.5 px-3'>3 / 8</TableCell>
                <TableCell className='py-2.5 px-3'>
                  <div className='w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5'>
                    <div
                      className='bg-blue-600 h-2.5 rounded-full'
                      style={{ width: '25%' }}
                    ></div>
                  </div>
                </TableCell>
                <TableCell className='py-2.5 px-3'>
                  <span className='px-2 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400 rounded-full text-xs font-medium'>
                    Paused
                  </span>
                </TableCell>
                <TableCell className='py-2.5 px-3'>
                  <div className='flex space-x-2'>
                    <Button size='sm' variant='ghost' className='h-8 w-8 p-0'>
                      <Play className='h-4 w-4' />
                    </Button>
                    <Button size='sm' variant='ghost' className='h-8 w-8 p-0'>
                      <Settings className='h-4 w-4' />
                    </Button>
                    <Button
                      size='sm'
                      variant='ghost'
                      className='h-8 w-8 p-0 text-red-500 dark:text-red-400'
                    >
                      <Trash className='h-4 w-4' />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>

              <TableRow className='hover:bg-muted/50'>
                <TableCell className='py-2.5 px-3'>Follow Users</TableCell>
                <TableCell className='py-2.5 px-3'>Follow</TableCell>
                <TableCell className='py-2.5 px-3'>0 / 5</TableCell>
                <TableCell className='py-2.5 px-3'>
                  <div className='w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5'>
                    <div
                      className='bg-blue-600 h-2.5 rounded-full'
                      style={{ width: '0%' }}
                    ></div>
                  </div>
                </TableCell>
                <TableCell className='py-2.5 px-3'>
                  <span className='px-2 py-1 bg-gray-100 dark:bg-gray-900/30 text-gray-800 dark:text-gray-400 rounded-full text-xs font-medium'>
                    Idle
                  </span>
                </TableCell>
                <TableCell className='py-2.5 px-3'>
                  <div className='flex space-x-2'>
                    <Button size='sm' variant='ghost' className='h-8 w-8 p-0'>
                      <Play className='h-4 w-4' />
                    </Button>
                    <Button size='sm' variant='ghost' className='h-8 w-8 p-0'>
                      <Settings className='h-4 w-4' />
                    </Button>
                    <Button
                      size='sm'
                      variant='ghost'
                      className='h-8 w-8 p-0 text-red-500 dark:text-red-400'
                    >
                      <Trash className='h-4 w-4' />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

const AccountsTab = () => {
  return (
    <div className='grid gap-4'>
      <div className='flex justify-between'>
        <div className='flex space-x-2.5'>
          <Button variant='outline'>
            <Checkbox className='mr-2 h-4 w-4' />
            Select All
          </Button>
          <Button variant='outline' className='text-red-500'>
            <Trash className='h-4 w-4 mr-2' />
            Delete Selected
          </Button>
        </div>
        <div className='flex space-x-2.5'>
          <Button variant='outline'>
            <Upload className='h-4 w-4 mr-2' />
            Import
          </Button>
          <Button variant='outline'>
            <Download className='h-4 w-4 mr-2' />
            Export
          </Button>
          <Button className='bg-blue-500 hover:bg-blue-600'>
            <Plus className='h-4 w-4 mr-2' />
            Add Account
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className='p-0'>
          <Table>
            <TableHeader>
              <TableRow className='border-b bg-muted/50'>
                <TableHead className='py-2.5 px-3 font-medium w-12'>
                  <Checkbox />
                </TableHead>
                <TableHead className='py-2.5 px-3 font-medium'>
                  Username
                </TableHead>
                <TableHead className='py-2.5 px-3 font-medium'>
                  Followers
                </TableHead>
                <TableHead className='py-2.5 px-3 font-medium'>
                  Following
                </TableHead>
                <TableHead className='py-2.5 px-3 font-medium'>Likes</TableHead>
                <TableHead className='py-2.5 px-3 font-medium'>
                  Status
                </TableHead>
                <TableHead className='py-2.5 px-3 font-medium'>
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[1, 2, 3, 4, 5].map((i) => (
                <TableRow key={i} className='border-b hover:bg-muted/50'>
                  <TableCell className='py-2.5 px-3'>
                    <Checkbox />
                  </TableCell>
                  <TableCell className='py-2.5 px-3'>tiktok_user_{i}</TableCell>
                  <TableCell className='py-2.5 px-3'>
                    {Math.floor(Math.random() * 1000)}
                  </TableCell>
                  <TableCell className='py-2.5 px-3'>
                    {Math.floor(Math.random() * 500)}
                  </TableCell>
                  <TableCell className='py-2.5 px-3'>
                    {Math.floor(Math.random() * 2000)}
                  </TableCell>
                  <TableCell className='py-2.5 px-3'>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        i % 3 === 0
                          ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                          : i % 3 === 1
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                          : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                      }`}
                    >
                      {i % 3 === 0
                        ? 'Locked'
                        : i % 3 === 1
                        ? 'Active'
                        : 'Limited'}
                    </span>
                  </TableCell>
                  <TableCell className='py-2.5 px-3'>
                    <div className='flex space-x-2'>
                      <Button size='sm' variant='ghost' className='h-8 w-8 p-0'>
                        <Settings className='h-4 w-4' />
                      </Button>
                      <Button
                        size='sm'
                        variant='ghost'
                        className='h-8 w-8 p-0 text-red-500 dark:text-red-400'
                      >
                        <Trash className='h-4 w-4' />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default TiktokView;
